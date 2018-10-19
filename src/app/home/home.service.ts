import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Project } from '../.models/project';
import { Files, File } from '../.models/file';
import { AppService } from '../app.service';
import { GroupService } from '../.services/group.service';
import { ProjectService } from '../.services/project.service';
import { Groups } from '../.models/group';

@Injectable()
export class HomeService {

  private readonly ID_REPOSITORY_TEMPLATE = '8886084';

  constructor(private appService: AppService,
    private groupService: GroupService,
    private projectService: ProjectService) { }

  getTemplates(): Observable<Files> {
    return this.projectService.getArchives(this.ID_REPOSITORY_TEMPLATE)
      .pipe(
        map((files: Files) => {
          files.forEach(file => file.technology = this.getStrDash(file.name));
          return files;
        }),
      );
  }

  getGroups(): Observable<Groups> {
    return this.groupService.getAll();
  }

  forkProject({ nameGroup, nameNewProject }) {
    return this.projectService.fork({ nameGroup, idProject: this.appService.project.id })
      .pipe(
        switchMap((forkedProject: Project) =>
          // Mudar o nome do projeto (pois vai com o nome do template)
          this.editProject({ id: forkedProject.id, name: nameNewProject }),
        ),
        switchMap((editedProject: Project) =>
          // Remover o relacionamento com o projeto de template
          this.deleteForkRelationship({ id: editedProject.id }),
        ));
  }

  editProject({ id, name }): Observable<Project> {
    return this.projectService.edit({ id, name })
      .pipe(
        map((project: Project) => {
          this.appService.project.http_url_to_repo = project.http_url_to_repo;
          return project;
        }));
  }

  deleteForkRelationship({ id }) {
    return this.projectService.deleteFork({ id });
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
