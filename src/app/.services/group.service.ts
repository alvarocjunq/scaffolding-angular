
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Groups, Group } from '../.models/group';

@Injectable({
  providedIn: 'root',
})
export class GroupService {

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Private-token': 'fz9HDNGBU11WSw9atiGt',
    }),
  };
  private readonly URL: string = 'https://gitlab.com/api/v4/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Groups> {
    return this.http.get<Groups>(`${this.URL}groups?owned=true`, this.httpOptions);
  }

  add({ name, parentId }): Observable<Group> {
    return this.http.post<Group>(`${this.URL}groups`,
      {
        name,
        path: name,
        parent_id: parentId,
      },
      this.httpOptions);
  }
}
