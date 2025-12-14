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
  isModalVisible = false;
  modalLoading = false;

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private message: NzMessageService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]],
      category: ['']
    });
    this.loadProducts();
  }

  loadProducts(): void {
    this.tableLoading = true;
    this.appService.getProducts().subscribe({
      next: (response) => {
        this.products = response.data || response;
        this.tableLoading = false;
      },
      error: () => {
        this.message.error('Failed to load products');
        this.tableLoading = false;
      }
    });
  }

  showAddModal(): void {
    this.isEditing = false;
    this.editingProductId = null;
    this.productForm.reset();
    this.isModalVisible = true;
  }

  showEditModal(product: any): void {
    this.isEditing = true;
    this.editingProductId = product._id;
    this.productForm.patchValue({
      code: product.code,
      name: product.name,
      price: product.price,
      category: product.category
    });
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.isEditing = false;
    this.editingProductId = null;
    this.productForm.reset();
  }

  handleOk(): void {
    if (this.productForm.valid) {
      this.modalLoading = true;

      if (this.isEditing && this.editingProductId) {
        // Update existing product
        this.appService.updateProduct(this.editingProductId, this.productForm.value).subscribe({
          next: () => {
            this.message.success('Product updated successfully');
            this.isModalVisible = false;
            this.modalLoading = false;
            this.isEditing = false;
            this.editingProductId = null;
            this.productForm.reset();
            this.loadProducts();
          },
          error: () => {
            this.message.error('Failed to update product');
            this.modalLoading = false;
          }
        });
      } else {
        // Add new product
        this.appService.addProduct(this.productForm.value).subscribe({
          next: () => {
            this.message.success('Product added successfully');
            this.isModalVisible = false;
            this.modalLoading = false;
            this.productForm.reset();
            this.loadProducts();
          },
          error: () => {
            this.message.error('Failed to add product');
            this.modalLoading = false;
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
