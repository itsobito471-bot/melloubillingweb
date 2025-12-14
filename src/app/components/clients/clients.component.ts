import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  clients: any[] = [];
  areas: any[] = [];
  clientForm!: FormGroup;
  loading = false;
  tableLoading = false;
  selectedArea: string = '';
  filteredSubareas: string[] = [];

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      area: [''],
      subarea: [''],
      address: ['']
    });

    this.loadClients();
    this.loadAreas();
  }

  loadClients(): void {
    this.tableLoading = true;
    this.appService.getClients().subscribe({
      next: (response) => {
        this.clients = response.data || response;
        this.tableLoading = false;
      },
      error: () => {
        this.tableLoading = false;
      }
    });
  }

  loadAreas(): void {
    this.appService.getAreas().subscribe({
      next: (response) => {
        this.areas = response.data || response;
      },
      error: () => {
        this.message.error('Failed to load areas');
      }
    });
  }

  onAreaChange(): void {
    const areaName = this.clientForm.get('area')?.value;
    this.selectedArea = areaName;

    // Clear subarea when area changes
    this.clientForm.patchValue({ subarea: '' });

    // Load subareas based on selected area
    if (areaName) {
      const selectedAreaObj = this.areas.find(a => a.name === areaName);
      if (selectedAreaObj) {
        this.appService.getSubareas(selectedAreaObj._id).subscribe({
          next: (response) => {
            const subareas = response.data || response;
            this.filteredSubareas = subareas.map((s: any) => s.name);
          },
          error: () => {
            this.filteredSubareas = [];
          }
        });
      } else {
        this.filteredSubareas = [];
      }
    } else {
      this.filteredSubareas = [];
    }
  }

  addClient(): void {
    if (this.clientForm.valid) {
      this.loading = true;
      this.appService.addClient(this.clientForm.value).subscribe({
        next: () => {
          this.message.success('Client added successfully');
          this.clientForm.reset();
          this.selectedArea = '';
          this.filteredSubareas = [];
          this.loadClients();
          this.loading = false;
        },
        error: () => {
          this.message.error('Failed to add client');
          this.loading = false;
        }
      });
    } else {
      Object.values(this.clientForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
