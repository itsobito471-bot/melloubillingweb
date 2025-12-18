import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
    users: any[] = [];
    loading = false;
    total = 0;
    pageSize = 10;
    pageIndex = 1;
    isModalVisible = false;
    isOkLoading = false;
    userForm!: FormGroup;

    constructor(
        private appService: AppService,
        private message: NzMessageService,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.loadUsers();
        this.initForm();
    }

    initForm(): void {
        this.userForm = this.fb.group({
            username: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            role: ['user', [Validators.required]]
        });
    }

    loadUsers(): void {
        this.loading = true;
        this.appService.getUsers(this.pageIndex, this.pageSize).subscribe({
            next: (res) => {
                this.users = res.users;
                this.total = res.total;
                this.loading = false;
            },
            error: (err) => {
                this.message.error(err.message || 'Failed to load users');
                this.loading = false;
            }
        });
    }

    onQueryParamsChange(params: any): void {
        const { pageIndex, pageSize } = params;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.loadUsers();
    }

    showModal(): void {
        this.isModalVisible = true;
        this.userForm.reset({ role: 'user' });
    }

    handleCancel(): void {
        this.isModalVisible = false;
    }

    handleOk(): void {
        if (this.userForm.valid) {
            this.isOkLoading = true;
            this.appService.createUser(this.userForm.value).subscribe({
                next: () => {
                    this.message.success('User created successfully');
                    this.isModalVisible = false;
                    this.isOkLoading = false;
                    this.loadUsers();
                },
                error: (err) => {
                    this.message.error(err.message || 'Failed to create user');
                    this.isOkLoading = false;
                }
            });
        } else {
            Object.values(this.userForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }

    toggleStatus(user: any): void {
        this.appService.toggleUserStatus(user._id).subscribe({
            next: (res) => {
                this.message.success(res.message);
                this.loadUsers();
            },
            error: (err) => {
                this.message.error(err.message || 'Action failed');
            }
        });
    }
}
