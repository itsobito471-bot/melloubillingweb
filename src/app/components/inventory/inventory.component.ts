import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  products: any[] = [];
  productForm!: FormGroup;
  loading = false;
  tableLoading = false;
  isEditing = false;
  editingProductId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private message: NzMessageService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]],
      // stock: [0, [Validators.required, Validators.min(0)]], // COMMENTED OUT - Stock not needed
      category: ['']
    });
    this.loadProducts();
  }

  loadProducts(): void {
    this.tableLoading = true;
    this.appService.getProducts().subscribe({
      next: (response) => {
        this.products = response.data || response; // Handle both paginated and non-paginated
        this.tableLoading = false;
      },
      error: (error) => {
        this.message.error('Failed to load products');
        this.tableLoading = false;
      }
    });
  }

  submitForm(): void {
    if (this.productForm.valid) {
      this.loading = true;

      if (this.isEditing && this.editingProductId) {
        // Update existing product
        this.updateProduct();
      } else {
        // Add new product
        this.appService.addProduct(this.productForm.value).subscribe({
          next: () => {
            this.message.success('Product added successfully');
            this.productForm.reset();
            this.loadProducts();
            this.loading = false;
          },
          error: (error) => {
            this.message.error('Failed to add product');
            this.loading = false;
          }
        });
      }
    } else {
      Object.values(this.productForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  editProduct(product: any): void {
    this.isEditing = true;
    this.editingProductId = product._id;
    this.productForm.patchValue({
      name: product.name,
      price: product.price,
      // stock: product.stock, // COMMENTED OUT
      category: product.category
    });
  }

  updateProduct(): void {
    if (!this.editingProductId) return;

    this.appService.updateProduct(this.editingProductId, this.productForm.value).subscribe({
      next: () => {
        this.message.success('Product updated successfully');
        this.cancelEdit();
        this.loadProducts();
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to update product');
        this.loading = false;
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingProductId = null;
    this.productForm.reset();
  }

  deleteProduct(id: string): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this product?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.appService.deleteProduct(id).subscribe({
          next: () => {
            this.message.success('Product deleted successfully');
            this.loadProducts();
          },
          error: () => {
            this.message.error('Failed to delete product');
          }
        });
      }
    });
  }
}
