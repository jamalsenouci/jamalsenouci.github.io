import requests
import nbformat
from nbconvert import HTMLExporter

url = """https://raw.githubusercontent.com/jamalsenouci/causalimpact/master/GettingStarted.ipynb"""
response = requests.get(url)

nb = nbformat.reads(response.text, as_version=4)

html_exporter = HTMLExporter()
html_exporter.template_file = 'basic'

(body, resources) = html_exporter.from_notebook_node(nb)
styles = "<style>\n" + "\n".join(resources["inlining"]["css"]) + "\n</style>\n"
html = styles + body
with open("projects/causalimpact.html", "w") as f:
    f.write(html)
