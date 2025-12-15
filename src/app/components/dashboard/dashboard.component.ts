import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/api.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Filters
  dateRange: Date[] = [];
  loading = false;

  // Stats
  summary = {
    income: 0,
    expenses: 0,
    netIncome: 0
  };

  // Charts Config
  barChartType: ChartType = 'bar';
  lineChartType: ChartType = 'line';

  // Enhanced Options for a Cleaner Look
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Clean look
      tooltip: {
        backgroundColor: '#1f2937',
        padding: 12,
        titleFont: { size: 13, family: "'Inter', sans-serif" },
        bodyFont: { size: 13, family: "'Inter', sans-serif" },
        displayColors: false,
        cornerRadius: 6,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 11 },
          color: '#6b7280'
        }
      },
      y: {
        grid: { color: '#f3f4f6' },
        border: { display: false },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 11 },
          color: '#6b7280',
          callback: function (value: any) {
            if (Number(value) >= 1000) {
              return '₹' + (Number(value) / 1000).toFixed(0) + 'k';
            }
            return '₹' + value;
          }
        },
        beginAtZero: true
      }
    }
  };

  // 1. Sales Trend
  salesTrendData: ChartData<'line'> = { datasets: [], labels: [] };

  // 2. Net Income (Bar)
  netIncomeData: ChartData<'bar'> = { datasets: [], labels: [] };

  // 3. Regional Sales
  regionalSalesData: ChartData<'bar'> = { datasets: [], labels: [] };

  // 4. Route Sales
  routeSalesData: ChartData<'bar'> = { datasets: [], labels: [] };

  // 5. Retail Sales
  retailSalesData: ChartData<'bar'> = { datasets: [], labels: [] };

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    // Default to current month
    const now = new Date();
    this.dateRange = [new Date(now.getFullYear(), now.getMonth(), 1), now];
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    const params = {
      startDate: this.dateRange[0],
      endDate: this.dateRange[1]
    };

    this.appService.getDashboardStats(params).subscribe({
      next: (res) => {
        this.summary = res.summary;
        this.setupCharts(res);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  setupCharts(data: any): void {
    // 1. Sales Trend (Smooth Purple Gradient feel)
    const trendLabels = data.salesTrend.map((d: any) => {
      const date = new Date(d._id);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });
    const trendValues = data.salesTrend.map((d: any) => d.sales);
    this.salesTrendData = {
      labels: trendLabels,
      datasets: [{
        data: trendValues,
        label: 'Daily Sales',
        borderColor: '#8b5cf6', // Violet-500
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#8b5cf6',
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2
      }]
    };

    // 2. Net Income (Dark/Light Contrast)
    this.netIncomeData = {
      labels: ['Income', 'Expenses'],
      datasets: [
        {
          data: [this.summary.income, this.summary.expenses],
          label: 'Amount',
          backgroundColor: ['#10b981', '#ef4444'], // Emerald-500, Red-500
          hoverBackgroundColor: ['#059669', '#dc2626'],
          barThickness: 50,
          borderRadius: 8
        }
      ]
    };

    // 3. Regional (Horizontal Bar maybe? Keeping vertical but styled)
    this.regionalSalesData = {
      labels: data.regionalSales.map((d: any) => d._id || 'Unassigned'),
      datasets: [{
        data: data.regionalSales.map((d: any) => d.total),
        label: 'Sales',
        backgroundColor: '#3b82f6', // Blue-500
        hoverBackgroundColor: '#2563eb',
        borderRadius: 6,
        barThickness: 40
      }]
    };

    // 4. Route Sales
    this.routeSalesData = {
      labels: data.routeSales.map((d: any) => d._id || 'General'),
      datasets: [{
        data: data.routeSales.map((d: any) => d.total),
        label: 'Note',
        backgroundColor: '#f59e0b', // Amber-500
        hoverBackgroundColor: '#d97706',
        borderRadius: 6,
        barThickness: 40
      }]
    };

    // 5. Retail Sales
    this.retailSalesData = {
      labels: data.retailSales.map((d: any) => d._id || 'Unknown'),
      datasets: [{
        data: data.retailSales.map((d: any) => d.total),
        label: 'Client Sales',
        backgroundColor: '#06b6d4', // Cyan-500
        hoverBackgroundColor: '#0891b2',
        borderRadius: 6,
        barThickness: 40
      }]
    };
  }
}
