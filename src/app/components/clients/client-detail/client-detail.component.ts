import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../../services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css']
})
export class ClientDetailComponent implements OnInit {
  client: any = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadClient(id);
    } else {
      this.backToList();
    }
  }

  loadClient(id: string): void {
    this.loading = true;
    this.appService.getClients().subscribe({
      next: (response) => {
        const clients = response.data || response;
        this.client = clients.find((c: any) => c._id === id);
        this.loading = false;
        if (!this.client) {
          this.message.error('Client not found');
          this.backToList();
        }
      },
      error: () => {
        this.message.error('Failed to load client details');
        this.loading = false;
        this.backToList();
      }
    });
  }

  backToList(): void {
    this.router.navigate(['/clients']);
  }

  editClient(): void {
    if (this.client) {
      this.router.navigate(['/clients/edit', this.client._id]);
    }
  }
}
