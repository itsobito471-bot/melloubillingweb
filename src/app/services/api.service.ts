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

    getHeaders() {
        let headers = new HttpHeaders()
            .set('X-Requested-With', 'XMLHttpRequest')
            .set('Content-Type', 'application/json');

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

    downloadBillPDF(billId: string): void {
        const url = `${this.apiEndPoint}/bills/${billId}/pdf`;

        // Use HTTP client with proper headers to download PDF
        this.http.get(url, {
            headers: this.getHeaders(),
            responseType: 'blob'
        }).subscribe({
            next: (blob: Blob) => {
                // Create a download link and trigger download
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

    addExpense(data: any): Observable<any> {
        return this.post('/expenses', data);
    }

    updateExpense(id: string, data: any): Observable<any> {
        return this.patch(`/expenses/${id}`, data);
    }

    deleteExpense(id: string): Observable<any> {
        return this.delete(`/expenses/${id}`);
    }
}
