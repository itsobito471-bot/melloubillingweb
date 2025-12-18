import { Component } from '@angular/core';
import { AppService } from './services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;
  notificationCount = 4; // You can make this dynamic later

  constructor(public appService: AppService, public router: Router) { }

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
