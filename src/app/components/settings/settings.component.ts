import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
    settingsForm!: FormGroup;
    loading = false;
    saving = false;

    constructor(
        private fb: FormBuilder,
        private appService: AppService,
        private message: NzMessageService
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.loadSettings();
    }

    initForm(): void {
        this.settingsForm = this.fb.group({
            companyName: ['', [Validators.required]],
            gstin: [''], // Company's own GSTIN
            address: [''],
            phone: [''],
            email: ['', [Validators.email]],
            cgstPercentage: [2.5, [Validators.required, Validators.min(0), Validators.max(100)]],
            sgstPercentage: [2.5, [Validators.required, Validators.min(0), Validators.max(100)]],
            accountName: [''],
            accountNo: [''],
            ifscCode: ['']
        });
    }

    loadSettings(): void {
        this.loading = true;
        this.appService.getSettings().subscribe({
            next: (settings: any) => {
                // settings is { key: value, key2: value2 }
                this.settingsForm.patchValue(settings);
                this.loading = false;
            },
            error: () => {
                this.message.error('Failed to load settings');
                this.loading = false;
            }
        });
    }

    saveSettings(): void {
        if (this.settingsForm.valid) {
            this.saving = true;
            const formData = this.settingsForm.value;

            this.appService.updateSettings(formData).subscribe({
                next: () => {
                    this.message.success('Settings saved successfully');
                    this.saving = false;
                },
                error: () => {
                    this.message.error('Failed to save settings');
                    this.saving = false;
                }
            });
        } else {
            Object.values(this.settingsForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }
}
