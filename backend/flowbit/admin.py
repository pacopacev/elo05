from django.contrib import admin
from .models import Machine, Operator, Product, MoldingSession, ProcessParameter, DefectLog

admin.site.register(Machine)
admin.site.register(Operator)
admin.site.register(Product)
admin.site.register(MoldingSession)
admin.site.register(ProcessParameter)
admin.site.register(DefectLog)
