import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Groups, Group } from '../.models/group';
import { HttpService } from './http.service';
import { map, switchMap, first, filter, isEmpty, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GroupService {

  constructor(private http: HttpService) { }

  getAll(): Observable<Groups> {
    return this.http.get<Groups>(`groups?owned=true`);
  }

  getByName(name: string): Observable<Group[]> {
    return this.http.get<Group[]>(`groups?search=${name}`);
  }

  /**
   * Adiciona um group no gitlab caso o mesmo não exista
   * @param fullPath Informar qual o caminho completo do grupo, para validação de existência
   * @param name Nome e path do grupo
   * @param parentId (opcional) Id do grupo pai
   */
  add(fullPath: string, name: string, parentId?: number): Observable<Group> {
    const groupAdd: any = {
      name,
      path: name,
      visibility: 'internal',
    };

    if (parentId) {
      groupAdd.parent_id = parentId;
    }

    return this.getByName(name).pipe(
      switchMap((groups: Groups) => {
        // Achou algum grupo com o nome enviado? Se não achou, cria
        if (groups.length === 0) {
          return this.http.post<Group>(`groups`, groupAdd);
        }

        const group = groups.find(_group => _group.full_path === fullPath);
        if (!group) {
          return this.http.post<Group>('groups', groupAdd);
        }
        return of(group);
      }),
    );
  }
}
