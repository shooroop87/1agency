# backend/properties/views.py
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.db.models import Q, Min, Max
from .models import Property, PropertyType, Location


def property_list(request):
    """API для списка объектов с фильтрацией"""
    qs = Property.objects.filter(is_active=True).select_related(
        'developer', 'property_type', 'location', 'image'
    )
    
    # Type filter (comma-separated)
    if types := request.GET.get('type'):
        type_list = [t.strip() for t in types.split(',') if t.strip() and t != 'all']
        if type_list:
            qs = qs.filter(property_type__slug__in=type_list)
    
    # Location/Area filter
    if areas := request.GET.get('area'):
        area_list = [a.strip() for a in areas.split(',') if a.strip() and a != 'all']
        if area_list:
            qs = qs.filter(location__slug__in=area_list)
    
    # Bedrooms filter
    if bedrooms := request.GET.get('bedrooms'):
        bed_list = [b.strip() for b in bedrooms.split(',') if b.strip() and b != 'all']
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
                        Q(bedrooms_min__isnull=True, bedrooms_max=num)
                    )
            if q:
                qs = qs.filter(q)
    
    # Price range filter (select dropdown)
    if price := request.GET.get('price'):
        if '-' in price:
            p_min, p_max = price.split('-')
            qs = qs.filter(
                Q(price_min__gte=int(p_min), price_min__lte=int(p_max)) |
                Q(price_max__gte=int(p_min), price_max__lte=int(p_max))
            )
        elif price.endswith('+'):
            p_min = int(price[:-1])
            qs = qs.filter(Q(price_min__gte=p_min) | Q(price_max__gte=p_min))
    
    # Area size filter (select dropdown)
    if area_size := request.GET.get('area_size'):
        if '-' in area_size:
            a_min, a_max = area_size.split('-')
            qs = qs.filter(
                Q(total_area_min__gte=int(a_min), total_area_min__lte=int(a_max)) |
                Q(total_area_max__gte=int(a_min), total_area_max__lte=int(a_max))
            )
        elif area_size.endswith('+'):
            a_min = int(area_size[:-1])
            qs = qs.filter(Q(total_area_min__gte=a_min) | Q(total_area_max__gte=a_min))
    
    # Status filter
    if status := request.GET.get('status'):
        status_list = [s.strip() for s in status.split(',') if s.strip() and s != 'all']
        if status_list:
            qs = qs.filter(status__in=status_list)
    
    # Ownership filter (leasehold/freehold)
    if ownership := request.GET.get('ownership'):
        own_list = [o.strip() for o in ownership.split(',') if o.strip()]
        if 'leasehold' in own_list and 'freehold' not in own_list:
            qs = qs.filter(leasehold_years__isnull=False)
        elif 'freehold' in own_list and 'leasehold' not in own_list:
            qs = qs.filter(leasehold_years__isnull=True)
    
    # Features filter (view, etc)
    if features := request.GET.get('features'):
        feat_list = [f.strip() for f in features.split(',') if f.strip()]
        for feat in feat_list:
            if feat == 'ocean-view':
                qs = qs.filter(view__icontains='ocean')
            elif feat == 'mountain-view':
                qs = qs.filter(view__icontains='mountain')
            elif feat == 'pool':
                qs = qs.filter(Q(facilities__icontains='pool') | Q(view__icontains='pool'))
            elif feat == 'balcony':
                qs = qs.filter(facilities__icontains='balcony')
            elif feat == 'rooftop':
                qs = qs.filter(facilities__icontains='rooftop')
    
    # Construction filter
    if construction := request.GET.get('construction'):
        const_list = [c.strip() for c in construction.split(',') if c.strip()]
        status_map = {
            'not-started': 'off_plan',
            'in-progress': 'construction', 
            'completed': 'ready',
        }
        mapped = [status_map.get(c) for c in const_list if c in status_map]
        if mapped:
            qs = qs.filter(status__in=mapped)
    
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
            'location': prop.location.name if prop.location else '',
            'price': float(prop.price_min) if prop.price_min else None,
            'price_display': prop.get_price_display(),
            'bedrooms': prop.get_bedrooms_display(),
            'total_area': prop.get_total_area_display(),
            'status': prop.status,
            'status_display': prop.get_status_display(),
            'roi': prop.get_roi_display(),
            'leasehold': prop.leasehold_years,
            'image': prop.image.url if prop.image else '/static/images/placeholder.jpg',
            'completion': f"Q{prop.completion_quarter} {prop.completion_year}" if prop.completion_year else '',
        })
    
    return JsonResponse({
        'results': properties,  # для совместимости с JS
        'properties': properties,
        'total': paginator.count,
        'pages': paginator.num_pages,
        'current_page': page_obj.number,
    })


def property_detail(request, pk):
    """API для одного объекта (модалка)"""
    try:
        prop = Property.objects.select_related(
            'developer', 'property_type', 'location', 'image'
        ).get(pk=pk, is_active=True)
    except Property.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)
    
    return JsonResponse({
        'id': prop.id,
        'title': prop.safe_translation_getter('title', default=''),
        'description': prop.safe_translation_getter('description', default=''),
        'type': prop.property_type.name if prop.property_type else '',
        'developer': prop.developer.name if prop.developer else '',
        'location': prop.location.name if prop.location else '',
        
        # Pricing
        'price_min': float(prop.price_min) if prop.price_min else None,
        'price_max': float(prop.price_max) if prop.price_max else None,
        'price_display': prop.get_price_display(),
        'price_per_sqm_min': float(prop.price_per_sqm_min) if prop.price_per_sqm_min else None,
        'price_per_sqm_max': float(prop.price_per_sqm_max) if prop.price_per_sqm_max else None,
        'price_per_sqm_display': prop.get_price_per_sqm_display(),
        
        # Size
        'bedrooms': prop.get_bedrooms_display(),
        'bedrooms_min': prop.bedrooms_min,
        'bedrooms_max': prop.bedrooms_max,
        'total_area': prop.get_total_area_display(),
        'total_area_min': float(prop.total_area_min) if prop.total_area_min else None,
        'total_area_max': float(prop.total_area_max) if prop.total_area_max else None,
        'living_area': prop.get_living_area_display(),
        'living_area_min': float(prop.living_area_min) if prop.living_area_min else None,
        'living_area_max': float(prop.living_area_max) if prop.living_area_max else None,
        'plot_area': prop.get_plot_area_display(),
        'plot_area_min': float(prop.plot_area_min) if prop.plot_area_min else None,
        'plot_area_max': float(prop.plot_area_max) if prop.plot_area_max else None,
        
        # Status
        'status': prop.status,
        'status_display': prop.get_status_display(),
        'completion': f"Q{prop.completion_quarter} {prop.completion_year}" if prop.completion_year else '',
        'completion_year': prop.completion_year,
        'completion_quarter': prop.completion_quarter,
        
        # Investment
        'roi': prop.get_roi_display(),
        'roi_min': float(prop.roi_min) if prop.roi_min else None,
        'roi_max': float(prop.roi_max) if prop.roi_max else None,
        'leasehold': prop.leasehold_years,
        
        # Features
        'view': prop.view,
        'facilities': prop.facilities,
        
        # Media
        'image': prop.image.url if prop.image else '/static/images/placeholder.jpg',
        'video': prop.video_url,
    })


def filter_options(request):
    """Доступные опции фильтров"""
    return JsonResponse({
        'types': list(PropertyType.objects.values('name', 'slug')),
        'locations': list(Location.objects.values('name', 'slug')),
        'statuses': [
            {'value': 'off_plan', 'label': 'Off-plan'},
            {'value': 'construction', 'label': 'Under Construction'},
            {'value': 'ready', 'label': 'Ready'},
        ],
        'price_ranges': [
            {'value': 'up_to_100k', 'label': 'Up to $100,000'},
            {'value': '100k_150k', 'label': '$100,000-$150,000'},
            {'value': '150k_200k', 'label': '$150,000-$200,000'},
            {'value': '200k_300k', 'label': '$200,000-$300,000'},
            {'value': '300k_500k', 'label': '$300,000-$500,000'},
            {'value': '500k_700k', 'label': '$500,000-$700,000'},
            {'value': '700k_1m', 'label': '$700,000-$1,000,000'},
            {'value': 'over_1m', 'label': 'From $1,000,000'},
        ],
        'rooms': [
            {'value': 'studio', 'label': 'Studio'},
            {'value': '1', 'label': '1BD'},
            {'value': '2', 'label': '2BD'},
            {'value': '3', 'label': '3BD'},
            {'value': '4', 'label': '4BD'},
            {'value': '5', 'label': '5BD+'},
        ],
    })