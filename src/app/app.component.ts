import { Component } from '@angular/core';
import { AppService } from './services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;
  notificationCount = 0;
  isPasswordModalVisible = false;
  isPasswordLoading = false;
  passwordForm!: any; // Using FormBuilder
  notifications: any[] = [];
  unreadCount = 0;

  constructor(
    public appService: AppService,
    public router: Router,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.initPasswordForm();
    if (this.isLoggedIn) {
      this.loadNotifications();
    }
  }

  initPasswordForm() {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  loadNotifications() {
    this.appService.getNotifications().subscribe(res => {
      this.notifications = res;
      this.unreadCount = this.notifications.filter(n => !n.isRead).length;
      this.notificationCount = this.unreadCount;
    });
  }

  showPasswordModal() {
    this.isPasswordModalVisible = true;
    this.passwordForm.reset();
  }

  handlePasswordCancel() {
    this.isPasswordModalVisible = false;
  }

  handlePasswordOk() {
    if (this.passwordForm.valid) {
      this.isPasswordLoading = true;
      this.appService.changePassword(this.passwordForm.value).subscribe({
        next: () => {
          this.message.success('Password updated successfully');
          this.isPasswordModalVisible = false;
          this.isPasswordLoading = false;
        },
        error: (err) => {
          this.message.error(err.error.message || 'Failed to update password');
          this.isPasswordLoading = false;
        }
      });
    } else {
      Object.values(this.passwordForm.controls).forEach((control: any) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  markAsRead(n: any) {
    if (!n.isRead) {
      this.appService.markNotificationAsRead(n._id).subscribe(() => {
        n.isRead = true;
        this.unreadCount--;
        this.notificationCount = this.unreadCount;
      });
    }
  }

  markAllAsRead() {
    this.appService.markAllNotificationsAsRead().subscribe(() => {
      this.notifications.forEach(n => n.isRead = true);
      this.unreadCount = 0;
      this.notificationCount = 0;
    });
  }

  get isLoggedIn(): boolean {
    return this.appService.isLoggedIn();
  }

  get currentUser() {
    return this.appService.getCurrentUser();
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  getUserInitials(): string {
    const user = this.currentUser;
    if (!user || !user.username) return 'A';

    const names = user.username.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return user.username.substring(0, 1).toUpperCase();
  }

  logout() {
    this.appService.logout();
  }
}
