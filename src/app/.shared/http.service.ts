import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HTTP_OPTIONS, URL_BASE } from '../.shared/config';

@Injectable({
    providedIn: 'root',
})
export class HttpService {

    constructor(private http: HttpClient) { }

    get<T>(url: string): Observable<T> {
        return this.http.get<T>(`${URL_BASE}${url}`, HTTP_OPTIONS)
            .pipe(catchError(this.handleError));
    }

    post<T>(url: string, body: any): Observable<T> {
        return this.http.post<T>(`${URL_BASE}${url}`,
            body,
            HTTP_OPTIONS)
            .pipe(catchError(this.handleError));
    }

    put<T>(url: string, body: any): Observable<T> {
        return this.http.put<T>(`${URL_BASE}${url}`,
            body,
            HTTP_OPTIONS)
            .pipe(catchError(this.handleError));
    }

    delete<T>(url: string): Observable<T> {
        return this.http.delete<T>(`${URL_BASE}${url}`,
            HTTP_OPTIONS)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: any) {
        return of(error);
    }
}
