import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../../../services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.css']
})
export class AreaListComponent implements OnInit {
  areas: any[] = [];
  loading = false;
  isModalVisible = false;
  areaForm!: FormGroup;
  modalLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private appService: AppService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.areaForm = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.loadAreas();
  }

  loadAreas(): void {
    this.loading = true;
    this.appService.getAreas().subscribe({
      next: (response) => {
        this.areas = response.data || response;
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load areas');
        this.loading = false;
      }
    });
  }

  showModal(): void {
    this.isModalVisible = true;
    this.areaForm.reset();
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.areaForm.reset();
  }

  handleOk(): void {
    if (this.areaForm.valid) {
      this.modalLoading = true;
      this.appService.addArea(this.areaForm.value).subscribe({
        next: () => {
          this.message.success('Area added successfully');
          this.isModalVisible = false;
          this.modalLoading = false;
          this.areaForm.reset();
          this.loadAreas();
        },
        error: () => {
          this.message.error('Failed to add area');
          this.modalLoading = false;
        }
      });
    } else {
      Object.values(this.areaForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  navigateToSubareas(): void {
    this.router.navigate(['/areas/subareas']);
  }
}
