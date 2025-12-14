import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../../services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-manager',
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.css']
})
export class CategoryManagerComponent implements OnInit {
  categories: any[] = [];
  loading = false;

  // Modal State
  isModalVisible = false;
  modalLoading = false;
  isEditing = false;
  editingId: string | null = null;
  categoryForm!: FormGroup;

  constructor(
    private appService: AppService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['']
    });
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.appService.getExpenseCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load categories');
        this.loading = false;
      }
    });
  }

  showAddModal(): void {
    this.isEditing = false;
    this.editingId = null;
    this.categoryForm.reset();
    this.isModalVisible = true;
  }

  showEditModal(category: any): void {
    this.isEditing = true;
    this.editingId = category._id;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description
    });
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.categoryForm.reset();
  }

  handleOk(): void {
    if (this.categoryForm.valid) {
      this.modalLoading = true;
      const data = this.categoryForm.value;

      if (this.isEditing && this.editingId) {
        this.appService.updateExpenseCategory(this.editingId, data).subscribe({
          next: () => {
            this.message.success('Category updated');
            this.isModalVisible = false;
            this.modalLoading = false;
            this.loadCategories();
          },
          error: (err) => {
            this.message.error(err.error?.message || 'Failed to update category');
            this.modalLoading = false;
          }
        });
      } else {
        this.appService.addExpenseCategory(data).subscribe({
          next: () => {
            this.message.success('Category added');
            this.isModalVisible = false;
            this.modalLoading = false;
            this.loadCategories();
          },
          error: (err) => {
            this.message.error(err.error?.message || 'Failed to add category');
            this.modalLoading = false;
          }
        });
      }
    } else {
      Object.values(this.categoryForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  deleteCategory(id: string): void {
    this.appService.deleteExpenseCategory(id).subscribe({
      next: () => {
        this.message.success('Category deleted');
        this.loadCategories();
      },
      error: (err) => {
        this.message.error(err.error?.message || 'Failed to delete category');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/expenses']);
  }
}
