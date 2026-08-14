# common/pagination.py
from rest_framework_gis.pagination import GeoJsonPagination

class StandardGeoJsonPagination(GeoJsonPagination):
    page_size = 25
    page_size_query_param = 'page_size'  # Allows ?page_size=50
    max_page_size = 200                  # Maximum limit allowed
    page_query_param = 'page'            # Page number selector (?page=2)