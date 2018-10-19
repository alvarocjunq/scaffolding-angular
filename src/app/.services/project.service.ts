import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Files, File } from '../.models/file';
import { Project } from '../.models/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  private readonly ID_REPOSITORY_TEMPLATE = '8886084';
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Private-token': 'fz9HDNGBU11WSw9atiGt',
    }),
  };

  private readonly URL: string = 'https://gitlab.com/api/v4/';

  constructor(private http: HttpClient) { }

  getArchives(idRepository: string): Observable<Files> {
    return this.http.get<Files>(`${this.URL}projects/${idRepository}/repository/tree`,
      this.httpOptions);
  }

  fork({ idProject, nameGroup }): Observable<Project> {
    return this.http.post<Project>(`${this.URL}projects/${idProject}/fork`,
      { namespace: nameGroup },
      this.httpOptions);
  }

  edit({ id, name }): Observable<Project> {
    return this.http.put<Project>(`${this.URL}projects/${id}`,
      { name, path: name },
      this.httpOptions);
  }

  deleteFork({ id }) {
    return this.http.delete(`${this.URL}projects/${id}/fork`, this.httpOptions);
  }
}
