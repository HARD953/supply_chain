from django.db import models
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model

User = get_user_model()

class TimeStampedModel(models.Model):
    """Modèle abstrait pour ajouter les champs created_at et updated_at"""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Supplier(TimeStampedModel):
    """Modèle pour les fournisseurs"""
    STATUS_CHOICES = [
        ('active', _('Active')),
        ('inactive', _('Inactive')),
    ]

    name = models.CharField(_('Name'), max_length=255)
    email = models.EmailField(_('Email'), unique=True)
    phone = models.CharField(_('Phone'), max_length=50, blank=True)
    address = models.TextField(_('Address'), blank=True)
    status = models.CharField(
        _('Status'),
        max_length=50,
        choices=STATUS_CHOICES,
        default='active'
    )

    class Meta:
        verbose_name = _('Supplier')
        verbose_name_plural = _('Suppliers')
        ordering = ['name']

    def __str__(self):
        return self.name

class Category(TimeStampedModel):
    """Modèle pour les catégories de produits"""
    name = models.CharField(_('Name'), max_length=255)
    description = models.TextField(_('Description'), blank=True)

    class Meta:
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')
        ordering = ['name']

    def __str__(self):
        return self.name

class Product(TimeStampedModel):
    """Modèle pour les produits"""
    STATUS_CHOICES = [
        ('active', _('Active')),
        ('inactive', _('Inactive')),
        ('out_of_stock', _('Out of Stock')),
    ]

    name = models.CharField(_('Name'), max_length=255)
    description = models.TextField(_('Description'), blank=True)
    price = models.DecimalField(
        _('Price'),
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    stock_quantity = models.PositiveIntegerField(
        _('Stock Quantity'),
        default=0
    )
    image_url = models.URLField(_('Image URL'), max_length=500, blank=True)
    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name=_('Supplier')
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products',
        verbose_name=_('Category')
    )
    status = models.CharField(
        _('Status'),
        max_length=50,
        choices=STATUS_CHOICES,
        default='active'
    )

    class Meta:
        verbose_name = _('Product')
        verbose_name_plural = _('Products')
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['supplier']),
            models.Index(fields=['category']),
        ]

    def __str__(self):
        return self.name

    def update_stock_status(self):
        """Met à jour le statut en fonction du stock"""
        if self.stock_quantity == 0:
            self.status = 'out_of_stock'
        elif self.status == 'out_of_stock':
            self.status = 'active'
        self.save()

class StockMovement(TimeStampedModel):
    """Modèle pour les mouvements de stock"""
    MOVEMENT_TYPES = [
        ('in', _('Stock In')),
        ('out', _('Stock Out')),
    ]

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='stock_movements',
        verbose_name=_('Product')
    )
    quantity = models.IntegerField(_('Quantity'))
    movement_type = models.CharField(
        _('Movement Type'),
        max_length=50,
        choices=MOVEMENT_TYPES
    )
    reason = models.CharField(_('Reason'), max_length=255)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='stock_movements',
        verbose_name=_('Created by')
    )

    class Meta:
        verbose_name = _('Stock Movement')
        verbose_name_plural = _('Stock Movements')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.movement_type} - {self.product.name} ({self.quantity})"

    def save(self, *args, **kwargs):
        """Override save pour mettre à jour le stock du produit"""
        if self.movement_type == 'in':
            self.product.stock_quantity += self.quantity
        else:
            self.product.stock_quantity = max(0, self.product.stock_quantity - self.quantity)
        
        self.product.update_stock_status()
        super().save(*args, **kwargs)