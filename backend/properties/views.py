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
    
    # Фильтры
    if types := request.GET.getlist('type'):
        qs = qs.filter(property_type__slug__in=types)
    
    if locations := request.GET.getlist('area'):
        qs = qs.filter(location__slug__in=locations)
    
    if bedrooms := request.GET.getlist('rooms'):
        q = Q()
        for b in bedrooms:
            if b == 'studio':
                # Studio = 0 bedrooms, check if range includes 0
                q |= Q(bedrooms_min=0) | Q(bedrooms_max=0) | Q(bedrooms_min__isnull=True, bedrooms_max=0)
            elif b.isdigit():
                num = int(b)
                # Check if number falls within the range [bedrooms_min, bedrooms_max]
                q |= (
                    Q(bedrooms_min__lte=num, bedrooms_max__gte=num) |
                    Q(bedrooms_min=num, bedrooms_max__isnull=True) |
                    Q(bedrooms_min__isnull=True, bedrooms_max=num) |
                    Q(bedrooms_min=num, bedrooms_max=num)
                )
        if q:
            qs = qs.filter(q)
    
    if statuses := request.GET.getlist('status'):
        qs = qs.filter(status__in=statuses)
    
    # Price ranges - check if property price range overlaps with filter range
    if prices := request.GET.getlist('price'):
        q = Q()
        ranges = {
            'up_to_100k': (0, 100000),
            '100k_150k': (100000, 150000),
            '150k_200k': (150000, 200000),
            '200k_300k': (200000, 300000),
            '300k_500k': (300000, 500000),
            '500k_700k': (500000, 700000),
            '700k_1m': (700000, 1000000),
            'over_1m': (1000000, 999999999),
        }
        for p in prices:
            if p in ranges:
                f_min, f_max = ranges[p]
                # Property overlaps with filter if: prop_min <= filter_max AND prop_max >= filter_min
                q |= (
                    Q(price_min__lte=f_max, price_max__gte=f_min) |
                    Q(price_min__lte=f_max, price_max__isnull=True, price_min__gte=f_min) |
                    Q(price_min__isnull=True, price_max__lte=f_max, price_max__gte=f_min)
                )
        if q:
            qs = qs.filter(q)
    
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
            'type': prop.property_type.name if prop.property_type else '',
            'type_slug': prop.property_type.slug if prop.property_type else '',
            'location': prop.location.name if prop.location else '',
            'location_slug': prop.location.slug if prop.location else '',
            # Price ranges
            'price_min': float(prop.price_min) if prop.price_min else None,
            'price_max': float(prop.price_max) if prop.price_max else None,
            'price_display': prop.get_price_display(),
            'price_per_sqm_display': prop.get_price_per_sqm_display(),
            # Size ranges
            'bedrooms': prop.get_bedrooms_display(),
            'bedrooms_min': prop.bedrooms_min,
            'bedrooms_max': prop.bedrooms_max,
            'total_area': prop.get_total_area_display(),
            'living_area': prop.get_living_area_display(),
            'plot_area': prop.get_plot_area_display(),
            # Status
            'status': prop.status,
            'status_display': prop.get_status_display(),
            # Investment
            'roi': prop.get_roi_display(),
            'leasehold': prop.leasehold_years,
            # Other
            'image': prop.image.url if prop.image else '/static/images/placeholder.jpg',
            'view': prop.view,
            'completion': f"Q{prop.completion_quarter} {prop.completion_year}" if prop.completion_year else '',
        })
    
    return JsonResponse({
        'properties': properties,
        'total': paginator.count,
        'pages': paginator.num_pages,
        'current_page': page_obj.number,
        'has_next': page_obj.has_next(),
        'has_prev': page_obj.has_previous(),
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