import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/api.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  data: any = null;
  loading = true;

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.loading = true;
    this.appService.getAnalytics().subscribe({
      next: (d: any) => {
        this.data = d;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
