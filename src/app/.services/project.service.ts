import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Files, File } from '../.models/file';
import { Project } from '../.models/project';
import { Commit } from '../.models/commit';
import { HttpService } from './http.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  constructor(private http: HttpService) { }

  getArchives(idProject: string): Observable<Files> {
    return this.http.get<Files>(`projects/${idProject}/repository/tree`);
  }

  getFileContent(idProject: string, path: string): Observable<File> {
    return this.http.get(`projects/${idProject}/repository/files/${path}?ref=master`)
      .pipe(map((file: File) => {
        file.content = atob(file.content);
        return file;
      }));
  }

  fork({ idProject, nameGroup }): Observable<Project> {
    return this.http.post<Project>(`projects/${idProject}/fork`,
      { namespace: nameGroup });
  }

  edit({ idProject, name }): Observable<Project> {
    return this.http.put<Project>(`projects/${idProject}`,
      { name, path: name, visibility: 'internal' });
  }

  deleteFork({ idProject }) {
    return this.http.delete(`projects/${idProject}/fork`);
  }

  updateFile(idProject: string, commit: Commit) {
    // const commit: Commit = {
    //   branch: 'master',
    //   commit_message: 'initial commit',
    //   actions: [{
    //     content: btoa(content),
    //     action: 'update',
    //     file_path: path,
    //     encoding: 'base64',
    //   }],
    // };

    return this.http.post(`projects/${idProject}/repository/commits`, commit);
  }
}
