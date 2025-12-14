import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css']
})
export class AreasComponent implements OnInit {
  areas: any[] = [];
  areaForm!: FormGroup;
  subareaForm!: FormGroup;
  loading = false;
  tableLoading = false;

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.areaForm = this.fb.group({
      name: ['', [Validators.required]]
    });

    this.subareaForm = this.fb.group({
      areaId: [null, [Validators.required]],
      name: ['', [Validators.required]]
    });

    this.loadAreas();
  }

  loadAreas(): void {
    this.tableLoading = true;
    this.appService.getAreas().subscribe({
      next: (response) => {
        this.areas = response.data || response;
        this.tableLoading = false;
      },
      error: () => {
        this.tableLoading = false;
      }
    });
  }

  addArea(): void {
    if (this.areaForm.valid) {
      this.loading = true;
      this.appService.addArea(this.areaForm.value).subscribe({
        next: () => {
          this.message.success('Area added successfully');
          this.areaForm.reset();
          this.loadAreas();
          this.loading = false;
        },
        error: () => {
          this.message.error('Failed to add area');
          this.loading = false;
        }
      });
    }
  }

  addSubarea(): void {
    if (this.subareaForm.valid) {
      this.loading = true;
      const payload = {
        areaId: this.subareaForm.value.areaId,
        subareaName: this.subareaForm.value.name
      };
      this.appService.addSubarea(payload).subscribe({
        next: () => {
          this.message.success('Subarea added successfully');
          this.subareaForm.patchValue({ name: '' });
          this.loadAreas();
          this.loading = false;
        },
        error: () => {
          this.message.error('Failed to add subarea');
          this.loading = false;
        }
      });
    }
  }

  getAllSubareas(): any[] {
    const subareas: any[] = [];
    this.areas.forEach(area => {
      if (area.subareas && area.subareas.length > 0) {
        area.subareas.forEach((subarea: string) => {
          subareas.push({
            name: subarea,
            areaName: area.name,
            areaId: area._id
          });
        });
      }
    });
    return subareas;
  }
}
