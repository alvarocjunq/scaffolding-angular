import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Files } from '../.models/file';
import { Project } from '../.models/project';
import { HttpService } from '../.shared/http.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  constructor(private http: HttpService) { }

  getArchives(idRepository: string): Observable<Files> {
    return this.http.get<Files>(`projects/${idRepository}/repository/tree`);
  }

  fork({ idProject, nameGroup }): Observable<Project> {
    return this.http.post<Project>(`projects/${idProject}/fork`,
      { namespace: nameGroup });
  }

  edit({ id, name }): Observable<Project> {
    return this.http.put<Project>(`projects/${id}`,
      { name, path: name });
  }

  deleteFork({ id }) {
    return this.http.delete(`projects/${id}/fork`);
  }
}
