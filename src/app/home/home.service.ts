import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project';
import { Files, File } from '../models/file';
import { AppService } from '../app.service';
import { map } from 'rxjs/operators';
import { Groups } from '../models/group';

@Injectable()
export class HomeService {

  private readonly ID_REPOSITORY_TEMPLATE = '8886084';
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Private-token': 'fz9HDNGBU11WSw9atiGt',
    }),
  };

  private readonly URL: string = 'https://gitlab.com/api/v4/';

  constructor(private http: HttpClient, private appService: AppService) { }

  getTemplates(): Observable<Files> {
    return this.http.get<Files>(`${this.URL}projects/${this.ID_REPOSITORY_TEMPLATE}/repository/tree`,
      this.httpOptions)
      .pipe(
        map((files: Files) => {
          files.map((file: File) => {
            file.technology = this.getStrDash(file.name);
            return file;
          });
          return files;
        }),
      );
  }

  getGroups(): Observable<Groups> {
    return this.http.get<Groups>(`${this.URL}groups?owned=true`, this.httpOptions);
  }

  forkProject({ nameGroup }): Observable<Project> {
    return this.http.post<Project>(`${this.URL}projects/${this.appService.project.id}/fork`,
      { namespace: nameGroup },
      this.httpOptions);
  }

  editProject({ id, name }): Observable<Project> {
    return this.http.put<Project>(`${this.URL}projects/${id}`,
      { name, path: name },
      this.httpOptions)
      .pipe(
        map((project: Project) => {
          this.appService.project.http_url_to_repo = project.http_url_to_repo;
          return project;
        }));
  }

  deleteForkRelationship({ id }) {
    return this.http.delete(`${this.URL}projects/${id}/fork`, this.httpOptions);
  }

  setTemplateId(files: Files, selectedType: string): void {
    let fileName = files.find((file: File) => {
      return this.getStrDash(file.name) === selectedType;
    }).name;

    fileName = fileName.split('-').reverse().join('-');
    this.appService.project.id = this.getStrDash(fileName);
  }

  private getStrDash(str: string): string {
    return str.substr(0, str.indexOf('-'));
  }
}
