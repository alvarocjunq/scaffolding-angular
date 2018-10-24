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

  add(name: string, parentId?: number): Observable<Group> {
    const group: any = {
      name,
      path: name,
    };

    if (parentId) {
      group.parent_id = parentId;
    }

    return this.http.post<Group>(`groups`, group);
  }
}
