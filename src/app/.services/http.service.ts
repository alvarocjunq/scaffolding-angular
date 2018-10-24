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
            .pipe(catchError(this.handleError<T>()));
    }

    post<T>(url: string, body: any): Observable<T> {
        return this.http.post<T>(`${URL_BASE}${url}`,
            body,
            HTTP_OPTIONS)
            .pipe(catchError(this.handleError<T>()));
    }

    put<T>(url: string, body: any): Observable<T> {
        return this.http.put<T>(`${URL_BASE}${url}`,
            body,
            HTTP_OPTIONS)
            .pipe(catchError(this.handleError<T>()));
    }

    delete<T>(url: string): Observable<T> {
        return this.http.delete<T>(`${URL_BASE}${url}`,
            HTTP_OPTIONS)
            .pipe(catchError(this.handleError<T>()));
    }

    private handleError<T>() {
        return (error: any): Observable<T> => {
            console.error(error); // TODO: implementar API de LOG
            throw (error as T);
        };
    }
}
