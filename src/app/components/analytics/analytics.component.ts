import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/api.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  data: any = null;

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.appService.getAnalytics().subscribe((d: any) => this.data = d);
  }
}
