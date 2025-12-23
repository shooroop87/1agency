# backend/properties/views.py
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.db.models import Q, Min, Max
from .models import Property, PropertyType, Location, Feature


def property_list(request):
    """API для списка объектов с фильтрацией"""
    qs = Property.objects.filter(is_active=True).select_related(
        'developer', 'property_type', 'location', 'image'
    ).prefetch_related('features')
    
    # Type filter
    if types := request.GET.get('type'):
        type_list = [t.strip() for t in types.split(',') if t.strip()]
        if type_list:
            qs = qs.filter(property_type__slug__in=type_list)
    
    # Bedrooms filter
    if bedrooms := request.GET.get('bedrooms'):
        bed_list = [b.strip() for b in bedrooms.split(',') if b.strip()]
        if bed_list:
            q = Q()
            for b in bed_list:
                if b == '5+':
                    q |= Q(bedrooms_min__gte=5) | Q(bedrooms_max__gte=5)
                elif b.isdigit():
                    num = int(b)
                    q |= (
                        Q(bedrooms_min__lte=num, bedrooms_max__gte=num) |
                        Q(bedrooms_min=num, bedrooms_max__isnull=True) |
                        Q(bedrooms_min__isnull=True, bedrooms_max=num) |
                        Q(bedrooms_min=num, bedrooms_max=num)
                    )
            if q:
                qs = qs.filter(q)
    
    # Price range filter
    if price := request.GET.get('price'):
        if '-' in price:
            parts = price.split('-')
            if len(parts) == 2:
                p_min, p_max = int(parts[0]), int(parts[1])
                qs = qs.filter(
                    Q(price_min__lte=p_max, price_max__gte=p_min) |
                    Q(price_min__lte=p_max, price_max__isnull=True) |
                    Q(price_min__isnull=True, price_max__gte=p_min)
                )
        elif price.endswith('+'):
            p_min = int(price[:-1])
            qs = qs.filter(Q(price_min__gte=p_min) | Q(price_max__gte=p_min))
    
    # Area size filter
    if area := request.GET.get('area'):
        if '-' in area:
            parts = area.split('-')
            if len(parts) == 2:
                a_min, a_max = int(parts[0]), int(parts[1])
                qs = qs.filter(
                    Q(total_area_min__lte=a_max, total_area_max__gte=a_min) |
                    Q(total_area_min__lte=a_max, total_area_max__isnull=True) |
                    Q(total_area_min__isnull=True, total_area_max__gte=a_min)
                )
        elif area.endswith('+'):
            a_min = int(area[:-1])
            qs = qs.filter(Q(total_area_min__gte=a_min) | Q(total_area_max__gte=a_min))
    
    # Sale status filter
    if status := request.GET.get('status'):
        status_list = [s.strip() for s in status.split(',') if s.strip()]
        if status_list:
            qs = qs.filter(sale_status__in=status_list)
    
    # Ownership filter
    if ownership := request.GET.get('ownership'):
        own_list = [o.strip() for o in ownership.split(',') if o.strip()]
        if own_list:
            qs = qs.filter(ownership_type__in=own_list)
    
    # Features filter
    if features := request.GET.get('features'):
        feat_list = [f.strip() for f in features.split(',') if f.strip()]
        if feat_list:
            qs = qs.filter(features__slug__in=feat_list).distinct()
    
    # Construction filter
    if construction := request.GET.get('construction'):
        const_list = [c.strip() for c in construction.split(',') if c.strip()]
        if const_list:
            qs = qs.filter(construction_status__in=const_list)
    
    # Location filter
    if location := request.GET.get('location'):
        loc_list = [l.strip() for l in location.split(',') if l.strip()]
        if loc_list:
            qs = qs.filter(location__slug__in=loc_list)
    
    # Сортировка
    sort = request.GET.get('sort', 'order')
    sort_map = {
        'price_asc': 'price_min',
        'price_desc': '-price_min',
        'newest': '-created_at',
        'order': 'order',
    }
    qs = qs.order_by(sort_map.get(sort, 'order'))
    
    # Пагинация
    page = request.GET.get('page', 1)
    per_page = request.GET.get('per_page', 12)
    paginator = Paginator(qs, per_page)
    page_obj = paginator.get_page(page)
    
    # Сериализация
    properties = []
    for prop in page_obj:
        properties.append({
            'id': prop.id,
            'title': prop.safe_translation_getter('title', default=''),
            'property_type': prop.property_type.name if prop.property_type else '',
            'property_type_slug': prop.property_type.slug if prop.property_type else '',
            'location': prop.location.name if prop.location else '',
            'location_slug': prop.location.slug if prop.location else '',
            'price': float(prop.price_min) if prop.price_min else None,
            'price_display': prop.get_price_display(),
            'bedrooms': prop.get_bedrooms_display(),
            'total_area': prop.get_total_area_display(),
            'sale_status': prop.sale_status,
            'sale_status_display': prop.get_sale_status_display(),
            'construction_status': prop.construction_status,
            'construction_display': prop.get_construction_status_display(),
            'ownership': prop.ownership_type,
            'roi': prop.get_roi_display(),
            'image': prop.image.url if prop.image else '/static/images/placeholder.jpg',
            'completion': prop.get_completion_display(),
            'features': [f.slug for f in prop.features.all()],
        })
    
    return JsonResponse({
        'results': properties,
        'total': paginator.count,
        'pages': paginator.num_pages,
        'current_page': page_obj.number,
    })


def property_detail(request, pk):
    """API для одного объекта (модалка)"""
    try:
        prop = Property.objects.select_related(
            'developer', 'property_type', 'location', 'image'
        ).prefetch_related('features', 'units').get(pk=pk, is_active=True)
    except Property.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)
    
    # Собираем units для комплексов
    units_data = []
    if prop.is_complex:
        for unit in prop.units.all():
            units_data.append({
                'type': unit.name,
                'details': unit.get_details_display(),
                'price': unit.get_price_display(),
            })
    
    # Construction display
    construction_parts = []
    if prop.completion_year:
        completion = f"Q{prop.completion_quarter} {prop.completion_year}" if prop.completion_quarter else str(prop.completion_year)
        construction_parts.append(f"Completion date: {completion}")
    if prop.launch_date:
        construction_parts.append(f"Launch: {prop.launch_date}")
    construction_display = '<br>'.join(construction_parts) if construction_parts else ''
    
    # Features как views (Pool, Garden, Ocean View...)
    features_list = [f.name for f in prop.features.all()]
    
    return JsonResponse({
        'id': prop.id,
        'title': prop.safe_translation_getter('title', default=''),
        'description': prop.safe_translation_getter('description', default=''),
        'property_type': prop.property_type.name if prop.property_type else '',
        'developer': prop.developer.name if prop.developer else '',
        'location': prop.location.name if prop.location else '',
        'location_detail': prop.address or '',
        'price_display': prop.get_price_display(),
        'price_per_sqm_display': prop.get_price_per_sqm_display(),
        'bedrooms': prop.get_bedrooms_display(),
        'total_area': prop.get_total_area_display(),
        'living_area': prop.get_living_area_display(),
        'plot_area': prop.get_plot_area_display(),
        'sale_status': prop.get_sale_status_display(),
        'construction_status': prop.get_construction_status_display(),
        'construction': construction_display,
        'ownership': prop.get_ownership_type_display(),
        'completion': prop.get_completion_display(),
        'roi': f"Projected ROI: {prop.get_roi_display()}" if prop.get_roi_display() else '',
        'leasehold': prop.leasehold_years,
        'features': features_list,
        'image': prop.image.url if prop.image else '/static/images/placeholder.jpg',
        'video': prop.video_url,
        # Complex specific
        'is_complex': prop.is_complex,
        'total_units': prop.total_units if prop.is_complex else None,
        'units': units_data,
    })

def filter_options(request):
    """Динамические опции фильтров из БД"""
    # Property Types из базы
    types = list(PropertyType.objects.values('name', 'slug', 'icon'))
    
    # Locations из базы
    locations = list(Location.objects.values('name', 'slug'))
    
    # Features из базы
    features = list(Feature.objects.values('name', 'slug', 'icon'))
    
    # Bedrooms - динамически из существующих объектов
    bed_values = set()
    for prop in Property.objects.filter(is_active=True).values('bedrooms_min', 'bedrooms_max'):
        if prop['bedrooms_min'] is not None:
            bed_values.add(prop['bedrooms_min'])
        if prop['bedrooms_max'] is not None:
            bed_values.add(prop['bedrooms_max'])
    bedrooms = sorted([b for b in bed_values if b <= 5]) + (['5+'] if any(b >= 5 for b in bed_values) else [])
    
    return JsonResponse({
        'types': types,
        'locations': locations,
        'features': features,
        'bedrooms': bedrooms,
        'sale_statuses': [
            {'value': 'presale', 'label': 'Pre-sale'},
            {'value': 'selling', 'label': 'Selling'},
            {'value': 'soldout', 'label': 'Sold Out'},
        ],
        'construction_statuses': [
            {'value': 'not_started', 'label': 'Not Started'},
            {'value': 'in_progress', 'label': 'In Progress'},
            {'value': 'completed', 'label': 'Completed'},
            {'value': 'on_hold', 'label': 'On Hold'},
        ],
        'ownership_types': [
            {'value': 'freehold', 'label': 'Freehold'},
            {'value': 'leasehold', 'label': 'Leasehold'},
        ],
    })
