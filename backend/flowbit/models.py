from django.db import models

class Machine(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=20, unique=True)
    status = models.CharField(max_length=20, choices=[('available', 'Available'), ('maintenance', 'Under Maintenance')])

    def __str__(self):
        return self.name


class Operator(models.Model):
    name = models.CharField(max_length=100)
    employee_id = models.CharField(max_length=20)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=100)
    product_code = models.CharField(max_length=30)
    cavity_count = models.PositiveIntegerField()

    def __str__(self):
        return self.name


class MoldingSession(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE)
    operator = models.ForeignKey(Operator, on_delete=models.SET_NULL, null=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    shift = models.CharField(max_length=10, choices=[('A', 'Shift A'), ('B', 'Shift B'), ('C', 'Shift C')])

    def __str__(self):
        return f"{self.product.name} on {self.machine.name} - {self.start_time}"


class ProcessParameter(models.Model):
    session = models.ForeignKey(MoldingSession, on_delete=models.CASCADE)
    temperature = models.DecimalField(max_digits=6, decimal_places=2)
    pressure = models.DecimalField(max_digits=6, decimal_places=2)
    cycle_time = models.DecimalField(max_digits=5, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)


class DefectLog(models.Model):
    session = models.ForeignKey(MoldingSession, on_delete=models.CASCADE)
    defect_type = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    remarks = models.TextField(blank=True, null=True)
    logged_at = models.DateTimeField(auto_now_add=True)
from django.db import models

# Create your models here.
