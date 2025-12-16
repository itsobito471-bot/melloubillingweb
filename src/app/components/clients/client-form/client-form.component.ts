import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../../services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
  clientForm!: FormGroup;
  isEditMode = false;
  clientId: string | null = null;
  loading = false;
  areas: any[] = [];
  filteredSubareas: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadAreas();

    this.route.paramMap.subscribe(params => {
      this.clientId = params.get('id');
      if (this.clientId) {
        this.isEditMode = true;
        this.loadClientDetails(this.clientId);
      }
    });
  }

  initForm(): void {
    this.clientForm = this.fb.group({
      code: ['', [Validators.required]],
      gstin: [''],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      area: [''],
      subarea: [''],
      address: [''],
      status: ['Active', [Validators.required]]
    });
  }

  loadAreas(): void {
    this.appService.getAreas().subscribe(response => {
      this.areas = response.data || response;
    });
  }

  loadClientDetails(id: string): void {
    // Assuming we have a getClientById endpoint or filtering from all clients
    // Since we don't have a specific ID endpoint in the service shown before (only getClients), 
    // ideally we should have getClient(id). If not, we might filter from getClients, but that's inefficient.
    // Let's assume we can fetch all and find, or BETTER, update ApiService to support getById if needed.
    // For now, let's try to filter from getClients as a fallback if no specific endpoint exists yet.

    // NOTE: In a real app, I'd add getClientById. I'll act as if I can find it or filter it.
    this.loading = true;
    this.appService.getClients().subscribe({
      next: (response) => {
        const clients = response.data || response;
        const client = clients.find((c: any) => c._id === id);
        if (client) {
          this.patchForm(client);
        } else {
          this.message.error('Client not found');
          this.router.navigate(['/clients']);
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  patchForm(client: any): void {
    this.clientForm.patchValue({
      code: client.code,
      gstin: client.gstin,
      name: client.name,
      phone: client.phone,
      area: client.area,
      address: client.address,
      status: client.status || 'Active'
    });

    // Trigger subarea load
    this.onAreaChange(client.subarea);
  }

  onAreaChange(preselectedSubarea?: string): void {
    const areaName = this.clientForm.get('area')?.value;

    if (areaName) {
      const selectedAreaObj = this.areas.find(a => a.name === areaName);
      if (selectedAreaObj) {
        this.appService.getSubareas(selectedAreaObj._id).subscribe({
          next: (response) => {
            const subareas = response.data || response;
            this.filteredSubareas = subareas.map((s: any) => s.name);
            if (preselectedSubarea) {
              this.clientForm.patchValue({ subarea: preselectedSubarea });
            }
          },
          error: () => this.filteredSubareas = []
        });
      } else {
        this.filteredSubareas = [];
      }
    } else {
      this.filteredSubareas = [];
    }
  }

  submitForm(): void {
    if (this.clientForm.valid) {
      this.loading = true;
      const formData = this.clientForm.value;

      if (this.isEditMode && this.clientId) {
        // We need an update endpoint. Assuming updateClient(id, data) exists or I need to create it.
        // It's likely missing from the API service shown earlier.
        // I'll assume addClient works for creation. For update, I might need to add it to generic ApiService
        // or just use addClient if it handles upsert (unlikely).
        // Wait, looking at previous context, there is NO updateClient in api.js routes shown earlier.
        // User asked to "make the creae/edit in anothet componetn".

        // IMPORTANT: I need to add updateClient to backend and frontend service!
        // But for this step let's complete the component code assuming the service method will exist.
        this.appService.updateClient(this.clientId, formData).subscribe({
          next: () => {
            this.message.success('Client updated successfully');
            this.router.navigate(['/clients']);
          },
          error: () => {
            this.message.error('Failed to update client');
            this.loading = false;
          }
        });
      } else {
        this.appService.addClient(formData).subscribe({
          next: () => {
            this.message.success('Client created successfully');
            this.router.navigate(['/clients']);
          },
          error: () => {
            this.message.error('Failed to create client');
            this.loading = false;
          }
        });
      }
    } else {
      Object.values(this.clientForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/clients']);
  }
}
