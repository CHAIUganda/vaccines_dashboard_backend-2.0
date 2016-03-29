import os

from django.conf import settings
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext


from django.views.generic import TemplateView, FormView

from home.forms import DocumentForm
from home.models import Document
from home.tasks import process_excel_file


class HomeView(TemplateView):
    template_name = "index.html"


def ImportView(request):
    # Handle file upload
    print(request.FILES)
    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            document = Document(document_type=1, content=request.FILES['docfile'])
            document.filename = document.content.name
            document.path = os.path.join(settings.MEDIA_ROOT, document.content.name)
            document.save()

            # asynchronously process the files
            #process_excel_file()

            # Redirect to the document list after POST
            return HttpResponseRedirect(reverse(ImportView))
    else:
        form = DocumentForm()  # A empty, unbound form

    # Load documents for the list page
    documents = Document.objects.all()

    # Render list page with the documents and the form
    return render_to_response(
        'list.html',
        {'documents': documents, 'form': form},
        context_instance=RequestContext(request)
    )


