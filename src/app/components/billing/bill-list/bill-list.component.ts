import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../../services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.css']
})
export class BillListComponent implements OnInit {
  bills: any[] = [];
  filteredBills: any[] = [];
  loading = false;
  searchText = '';
  dateRange: Date[] = [];

  constructor(
    private router: Router,
    private appService: AppService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.loadBills();
  }

  loadBills(): void {
    this.loading = true;
    this.appService.getBills().subscribe({
      next: (response) => {
        this.bills = response.data || response;
        this.filteredBills = [...this.bills];
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load bills');
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onDateRangeChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.bills];

    // Search filter
    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(bill =>
        bill.client?.name?.toLowerCase().includes(search) ||
        bill.client?.phone?.toLowerCase().includes(search)
      );
    }

    // Date range filter
    if (this.dateRange && this.dateRange.length === 2) {
      const [start, end] = this.dateRange;
      filtered = filtered.filter(bill => {
        const billDate = new Date(bill.date);
        return billDate >= start && billDate <= end;
      });
    }

    this.filteredBills = filtered;
  }

  clearFilters(): void {
    this.searchText = '';
    this.dateRange = [];
    this.filteredBills = [...this.bills];
  }

  onCreateBill(): void {
    this.router.navigate(['/billing/create']);
  }

  downloadPDF(billId: string): void {
    this.loading = true;
    this.appService.downloadBillPDF(billId);
    this.message.success('Downloading PDF...');
    this.loading = false;
  }

  getTotal(bill: any): number {
    return bill.items?.reduce((sum: number, item: any) =>
      sum + (item.price * item.quantity), 0) || 0;
  }
}
