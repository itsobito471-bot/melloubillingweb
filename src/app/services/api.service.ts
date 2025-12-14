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

    // Bill methods
    createBill(data: any): Observable<any> {
        return this.post('/bills', data);
    }

    getBills(): Observable<any> {
        return this.get('/bills');
    }

    // Area methods
    getAreas(): Observable<any> {
        return this.get('/areas');
    }

    addArea(data: any): Observable<any> {
        return this.post('/areas', data);
    }

    addSubarea(data: any): Observable<any> {
        return this.post('/areas/subarea', data);
    }

    // Analytics methods
    getAnalytics(): Observable<any> {
        return this.get('/analytics');
    }
}
