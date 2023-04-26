from rest_framework.authentication import TokenAuthentication
from rest_framework.pagination import PageNumberPagination


class BearerAuthentication(TokenAuthentication):
    keyword = "Bearer"


class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
