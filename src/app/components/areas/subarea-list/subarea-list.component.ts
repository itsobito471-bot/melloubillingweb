import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../../../services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-subarea-list',
  templateUrl: './subarea-list.component.html',
  styleUrls: ['./subarea-list.component.css']
})
export class SubareaListComponent implements OnInit {
  areas: any[] = [];
  subareas: any[] = [];
  loading = false;
  isModalVisible = false;
  subareaForm!: FormGroup;
  modalLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private appService: AppService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.subareaForm = this.fb.group({
      areaId: [null, [Validators.required]],
      name: ['', [Validators.required]]
    });
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    // Load areas for dropdown
    this.appService.getAreas().subscribe({
      next: (response) => {
        this.areas = response.data || response;
      },
      error: () => {
        this.message.error('Failed to load areas');
      }
    });

    // Load subareas
    this.appService.getSubareas().subscribe({
      next: (response) => {
        this.subareas = response.data || response;
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load subareas');
        this.loading = false;
      }
    });
  }

  showModal(): void {
    this.isModalVisible = true;
    this.subareaForm.reset();
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.subareaForm.reset();
  }

  handleOk(): void {
    if (this.subareaForm.valid) {
      this.modalLoading = true;
      this.appService.addSubarea(this.subareaForm.value).subscribe({
        next: () => {
          this.message.success('Subarea added successfully');
          this.isModalVisible = false;
          this.modalLoading = false;
          this.subareaForm.reset();
          this.loadData();
        },
        error: () => {
          this.message.error('Failed to add subarea');
          this.modalLoading = false;
        }
      });
    } else {
      Object.values(this.subareaForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  navigateToAreas(): void {
    this.router.navigate(['/areas']);
  }
}
