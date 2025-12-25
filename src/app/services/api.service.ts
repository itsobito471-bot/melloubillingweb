import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AppService {
    apiEndPoint = environment.apiEndPoint;

    constructor(public http: HttpClient, public router: Router) { }

    // Making GET request
    public get<T>(url: string): Observable<T> {
        return this.http.get<T>(this.apiEndPoint + url, {
            headers: this.getHeaders(),
        });
    }

    // Making DELETE request
    public delete(url: string): Observable<any> {
        return this.http.delete(this.apiEndPoint + url, {
            headers: this.getHeaders(),
        });
    }

    // Making POST request
    public post<T>(url: string, data: any): Observable<T> {
        return this.http.post<T>(this.apiEndPoint + url, data, {
            headers: this.getHeaders(),
        });
    }

    // Making PUT request
    public put<T>(url: string, data: any): Observable<T> {
        return this.http.put<T>(this.apiEndPoint + url, data, {
            headers: this.getHeaders(),
        });
    }

    // Making PATCH request
    public patch<T>(url: string, data: any): Observable<T> {
        return this.http.patch<T>(this.apiEndPoint + url, data, {
            headers: this.getHeaders(),
        });
    }

    getHeaders(excludeContentType: boolean = false) {
        let headers = new HttpHeaders()
            .set('X-Requested-With', 'XMLHttpRequest');

        if (!excludeContentType) {
            headers = headers.set('Content-Type', 'application/json');
        }

        const token = sessionStorage.getItem('accountAccessToken');
        if (token) {
            headers = headers.set('Authorization', 'Bearer ' + token);
        }
        return headers;
    }

    // Authentication methods
    public login(username: string, password: string): Observable<any> {
        return this.post('/auth/login', { username, password });
    }

    public register(data: any): Observable<any> {
        return this.post('/auth/register', data);
    }

    public getMe(): Observable<any> {
        return this.get('/auth/me');
    }

    public logout() {
        sessionStorage.removeItem('accountAccessToken');
        sessionStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }

    public isLoggedIn(): boolean {
        return !!sessionStorage.getItem('accountAccessToken');
    }

    public getCurrentUser() {
        const user = sessionStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    // Product/Inventory methods
    getProducts(): Observable<any> {
        return this.get('/products');
    }

    addProduct(data: any): Observable<any> {
        return this.post('/products', data);
    }

    updateProduct(id: string, data: any): Observable<any> {
        return this.patch(`/products/${id}`, data);
    }

    deleteProduct(id: string): Observable<any> {
        return this.delete(`/products/${id}`);
    }

    // Client methods
    getClients(): Observable<any> {
        return this.get('/clients');
    }

    addClient(data: any): Observable<any> {
        return this.post('/clients', data);
    }

    updateClient(id: string, data: any): Observable<any> {
        return this.patch(`/clients/${id}`, data);
    }

    // Bill methods
    createBill(data: any): Observable<any> {
        return this.post('/bills', data);
    }

    getBills(): Observable<any> {
        return this.get('/bills');
    }

    getBillById(id: string): Observable<any> {
        return this.get(`/bills/${id}`);
    }

    updateBill(id: string, data: any): Observable<any> {
        return this.patch(`/bills/${id}`, data);
    }

    deleteBill(id: string): Observable<any> {
        return this.delete(`/bills/${id}`);
    }

    downloadBillPDF(billId: string): void {
        this.getBillPDF(billId).subscribe({
            next: (blob: Blob) => {
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `bill-${billId}.pdf`;
                link.click();
                window.URL.revokeObjectURL(downloadUrl);
            },
            error: (error) => {
                console.error('Error downloading PDF:', error);
            }
        });
    }

    getBillPDF(billId: string): Observable<Blob> {
        const url = `${this.apiEndPoint}/bills/${billId}/pdf`;
        return this.http.get(url, {
            headers: this.getHeaders(),
            responseType: 'blob'
        });
    }

    // Area methods
    getAreas(): Observable<any> {
        return this.get('/areas');
    }

    addArea(data: any): Observable<any> {
        return this.post('/areas', data);
    }

    // Subarea methods
    getSubareas(areaId?: string): Observable<any> {
        const url = areaId ? `/subareas?areaId=${areaId}` : '/subareas';
        return this.get(url);
    }

    addSubarea(data: any): Observable<any> {
        return this.post('/subareas', data);
    }

    // Analytics methods
    getAnalytics(): Observable<any> {
        return this.get('/analytics');
    }

    getDashboardStats(params?: any): Observable<any> {
        let url = '/dashboard/stats';
        if (params) {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key]) {
                    if (params[key] instanceof Date) {
                        queryParams.append(key, params[key].toISOString());
                    } else {
                        queryParams.append(key, params[key]);
                    }
                }
            });
            url += '?' + queryParams.toString();
        }
        return this.get(url);
    }

    // Expense Categories methods
    getExpenseCategories(): Observable<any> {
        return this.get('/expenses/categories');
    }

    addExpenseCategory(data: any): Observable<any> {
        return this.post('/expenses/categories', data);
    }

    updateExpenseCategory(id: string, data: any): Observable<any> {
        return this.patch(`/expenses/categories/${id}`, data);
    }

    deleteExpenseCategory(id: string): Observable<any> {
        return this.delete(`/expenses/categories/${id}`);
    }

    // Settings methods
    getSettings(): Observable<any> {
        return this.get('/settings');
    }

    updateSettings(data: any): Observable<any> {
        return this.post('/settings', data);
    }

    // Expenses methods
    getExpenses(params?: any): Observable<any> {
        let url = '/expenses';
        if (params) {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key]) queryParams.append(key, params[key]);
            });
            url += '?' + queryParams.toString();
        }
        return this.get(url);
    }

    getExpenseById(id: string): Observable<any> {
        return this.get(`/expenses/${id}`);
    }

    addExpense(data: any): Observable<any> {
        if (data instanceof FormData) {
            return this.http.post(this.apiEndPoint + '/expenses', data, {
                headers: this.getHeaders(true)
            });
        }
        return this.post('/expenses', data);
    }

    updateExpense(id: string, data: any): Observable<any> {
        if (data instanceof FormData) {
            return this.http.patch(this.apiEndPoint + `/expenses/${id}`, data, {
                headers: this.getHeaders(true)
            });
        }
        return this.patch(`/expenses/${id}`, data);
    }

    deleteExpense(id: string): Observable<any> {
        return this.delete(`/expenses/${id}`);
    }

    // User Management methods
    getUsers(page: number = 1, limit: number = 10): Observable<any> {
        return this.get(`/users?page=${page}&limit=${limit}`);
    }

    createUser(data: any): Observable<any> {
        return this.post('/users', data);
    }

    toggleUserStatus(id: string): Observable<any> {
        return this.patch(`/users/${id}/status`, {});
    }

    // Profile & Notifications methods
    changePassword(data: any): Observable<any> {
        return this.post('/auth/change-password', data);
    }

    getNotifications(): Observable<any> {
        return this.get('/notifications');
    }

    markNotificationAsRead(id: string): Observable<any> {
        return this.patch(`/notifications/${id}/read`, {});
    }

    markAllNotificationsAsRead(): Observable<any> {
        return this.post('/notifications/read-all', {});
    }
}
