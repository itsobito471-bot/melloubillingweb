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
      stock: [0, [Validators.required, Validators.min(0)]],
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
      this.appService.addProduct(this.productForm.value).subscribe({
        next: () => {
          this.message.success('Product added successfully');
          this.productForm.reset({ stock: 0 });
          this.loadProducts();
          this.loading = false;
        },
        error: (error) => {
          this.message.error('Failed to add product');
          this.loading = false;
        }
      });
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
