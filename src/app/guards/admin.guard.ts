import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppService } from '../services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(
        private appService: AppService,
        private router: Router,
        private message: NzMessageService
    ) { }

    canActivate(): boolean {
        const user = this.appService.getCurrentUser();
        if (this.appService.isLoggedIn() && user?.role === 'admin') {
            return true;
        }

        this.message.error('Access Denied: Admin privileges required');
        this.router.navigate(['/dashboard']);
        return false;
    }
}
