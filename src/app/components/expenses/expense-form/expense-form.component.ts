import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../../services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})
export class ExpenseFormComponent implements OnInit {
  expenseForm!: FormGroup;
  isEditMode = false;
  expenseId: string | null = null;
  categories: any[] = [];
  loading = false;

  paymentMethods = ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Other'];

  // File Upload
  fileList: NzUploadFile[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      date: [new Date(), [Validators.required]],
      category: [null, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required]],
      paymentMethod: ['Cash', [Validators.required]]
    });

    this.loadCategories();

    this.route.paramMap.subscribe(params => {
      this.expenseId = params.get('id');
      if (this.expenseId) {
        this.isEditMode = true;
        this.loadExpense(this.expenseId);
      }
    });
  }

  loadCategories(): void {
    this.appService.getExpenseCategories().subscribe(data => this.categories = data);
  }

  loadExpense(id: string): void {
    this.loading = true;
    // Using the new getExpenseById method
    this.appService.getExpenseById(id).subscribe({
      next: (expense) => {
        this.patchForm(expense);
        this.loading = false;
      },
      error: () => {
        this.message.error('Expense not found');
        this.router.navigate(['/expenses/all']);
      }
    });
  }

  existingReceiptUrl: string | null = null;

  patchForm(expense: any): void {
    this.expenseForm.patchValue({
      date: new Date(expense.date),
      category: expense.category?._id || expense.category,
      amount: expense.amount,
      description: expense.description,
      paymentMethod: expense.paymentMethod
    });

    if (expense.receiptUrl) {
      // Construct full URL assuming apiEndPoint ends with /api
      const baseUrl = this.appService.apiEndPoint.replace(/\/api\/?$/, '');
      this.existingReceiptUrl = `${baseUrl}${expense.receiptUrl}`;

      // Improve UX: add a dummy file object to fileList so user sees "1 file present" (Optional but good)
      // Or just show a link below. Link is safer.
    }
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    // Limit to 1 file
    if (this.fileList.length > 1) {
      this.fileList = [file];
    }
    return false;
  };

  removeFile = (file: NzUploadFile): boolean => {
    this.fileList = [];
    return true;
  }

  submitForm(): void {
    if (this.expenseForm.valid) {
      this.loading = true;

      const formData = new FormData();
      const formValue = this.expenseForm.value;

      Object.keys(formValue).forEach(key => {
        let value = formValue[key];
        if (key === 'date' && value instanceof Date) {
          value = value.toISOString();
        }
        formData.append(key, value);
      });

      if (this.fileList.length > 0) {
        // Native file object is stored in 'originFileObj' for NzUploadFile if using beforeUpload
        // But strict generic type might miss it unless casted or using any. 
        // NzUploadFile usually wraps the native file.
        const file: any = this.fileList[0];
        formData.append('receipt', file);
      }

      if (this.isEditMode && this.expenseId) {
        this.appService.updateExpense(this.expenseId, formData).subscribe({
          next: () => {
            this.message.success('Expense updated');
            this.router.navigate(['/expenses/all']);
          },
          error: (err) => {
            this.message.error(err.error?.message || 'Failed to update expense');
            this.loading = false;
          }
        });
      } else {
        this.appService.addExpense(formData).subscribe({
          next: () => {
            this.message.success('Expense added');
            this.router.navigate(['/expenses/all']);
          },
          error: (err) => {
            this.message.error(err.error?.message || 'Failed to add expense');
            this.loading = false;
          }
        });
      }
    } else {
      Object.values(this.expenseForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/expenses/all']);
  }
}
