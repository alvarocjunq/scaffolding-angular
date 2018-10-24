import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Groups, Group } from '../.models/group';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService {

  constructor(private http: HttpService) { }

  getAll(): Observable<Groups> {
    return this.http.get<Groups>(`groups?owned=true`);
  }

  add({ name, parentId }): Observable<Group> {
    return this.http.post<Group>(`groups`,
      {
        name,
        path: name,
        parent_id: parentId,
      });
  }
}
