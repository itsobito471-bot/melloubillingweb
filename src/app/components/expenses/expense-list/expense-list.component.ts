import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent implements OnInit {
  expenses: any[] = [];
  categories: any[] = [];
  loading = false;

  // Filters
  filterCategoryId: string | null = null;
  dateRange: Date[] = [];

  // Pagination
  page = 1;
  limit = 10;
  total = 0;

  constructor(
    private appService: AppService,
    private message: NzMessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadExpenses();
  }

  loadCategories(): void {
    this.appService.getExpenseCategories().subscribe(data => this.categories = data);
  }

  loadExpenses(): void {
    this.loading = true;
    const params: any = {
      page: this.page,
      limit: this.limit
    };

    if (this.filterCategoryId) {
      params.categoryId = this.filterCategoryId;
    }

    if (this.dateRange.length === 2) {
      params.startDate = this.dateRange[0].toISOString();
      params.endDate = this.dateRange[1].toISOString();
    }

    this.appService.getExpenses(params).subscribe({
      next: (res) => {
        this.expenses = res.data;
        this.total = res.pagination.total;
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load expenses');
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadExpenses();
  }

  onPageIndexChange(page: number): void {
    this.page = page;
    this.loadExpenses();
  }

  deleteExpense(id: string): void {
    this.appService.deleteExpense(id).subscribe({
      next: () => {
        this.message.success('Expense deleted');
        this.loadExpenses();
      },
      error: () => this.message.error('Failed to delete expense')
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/expenses/create']);
  }

  navigateToEdit(id: string): void {
    this.router.navigate(['/expenses/edit', id]);
  }

  navigateToCategories(): void {
    this.router.navigate(['/expenses/categories']);
  }
}
