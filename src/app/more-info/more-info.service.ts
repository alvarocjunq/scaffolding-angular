import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../models/group';
import { Project } from '../models/project';
import { AppService } from '../app.service';

@Injectable()
export class MoreInfoService {

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Private-token': 'fz9HDNGBU11WSw9atiGt',
    }),
  };

  private readonly url: string = 'https://gitlab.com/api/v4/';

  constructor(private http: HttpClient, private appService: AppService) { }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.url}groups?owned=true`, this.httpOptions);
  }

  forkProject({ nameGroup }): Observable<Project> {
    return this.http.post<Project>(`${this.url}projects/${this.appService.project.id}/fork`,
                                   { namespace: nameGroup },
                                   this.httpOptions);
  }

  editProject({ id, name }): Observable<Project> {
    return this.http.put<Project>(`${this.url}projects/${id}`,
                                  { name, path: name },
                                  this.httpOptions);
  }

  deleteForkRelationship({ id }) {
    return this.http.delete(`${this.url}projects/${id}/fork`, this.httpOptions);
  }
}
