import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../../services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: any[] = [];
  loading = false;
  searchText = '';

  constructor(
    private appService: AppService,
    private router: Router,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.appService.getClients().subscribe({
      next: (response) => {
        this.clients = response.data || response;
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load clients');
        this.loading = false;
      }
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/clients/create']);
  }

  navigateToEdit(id: string): void {
    this.router.navigate(['/clients/edit', id]);
  }

  navigateToView(id: string): void {
    this.router.navigate(['/clients/view', id]);
  }

  onSearch(): void {
    // Implement local search or server-side search
    // For now, simple filter
  }

  get filteredClients() {
    if (!this.searchText) return this.clients;
    return this.clients.filter(client =>
      client.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      client.phone.includes(this.searchText) ||
      (client.code && client.code.toLowerCase().includes(this.searchText.toLowerCase()))
    );
  }
}
