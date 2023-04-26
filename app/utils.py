from django.template import Context, Template
from weasyprint import CSS, HTML
from weasyprint.text.fonts import FontConfiguration

from app.models import Font


def build_html(html, context, css="") -> str:
    # Custom fonts
    fonts = Font.objects.all()
    head = ""
    for font in fonts:
        if font.name in html:
            head += f'<link href="{font.url}" rel="stylesheet" />\n'
    # Page break
    html = html.replace("<hr>", "<div style='break-after:always'></div>")
    html = (
        '{% extends "pdf-base.html" %}{% load humanize %}{% load mathfilters %}{% block style %}'
        + css
        + "{% endblock %}{% block head %}"
        + head
        + "{% endblock %}{% block content %}"
        + html
        + "{% endblock %}"
    )
    template = Template(html)
    c = Context(context)
    result = template.render(c)
    return result


def build_pdf(html, css="", path=None):
    font_config = FontConfiguration()
    wp_html = HTML(string=html)
    wp_css = CSS(
        string=css,
        font_config=font_config,
    )
    content = wp_html.write_pdf(path, stylesheets=[wp_css], font_config=font_config)
    return content
