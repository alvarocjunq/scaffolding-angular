import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { Project } from '../.models/project';
import { Files, File } from '../.models/file';
import { Groups, Group } from '../.models/group';
import { AppService } from '../app.service';
import { GroupService } from '../.services/group.service';
import { ProjectService } from '../.services/project.service';

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

  forkProject(valueForm: any, nameNewProject: string) {

    // this.groupService.add() adicionar capa
    // this.groupService.add() adicionar sistema
    // this.groupService.add() adicionar subsistema

    // return forkJoin([
    //   this.groupService.add({ name: valueForm.capa, parentId: valueForm.selectedGroup.id }), // adicionar capa
    //   this.groupService.add({ name: valueForm.sistema, parentId: '' }), // adicionar sistema
    //   this.groupService.add({ name: valueForm.subsistema, parentId: '' }), // adicionar subsistema
    // ], (_capa, _sistema, _subsistema) => {
    //   return _subsistema;
    // })
    return this.groupService.add({ name: valueForm.capa, parentId: valueForm.selectedGroup.id })
      .pipe(
        switchMap((group: Group) =>
          this.groupService.add({ name: valueForm.sistema, parentId: group.id }),
        ),
        switchMap((group: Group) =>
          this.groupService.add({ name: valueForm.subsistema, parentId: group.id }),
        ),
        switchMap((group: Group) =>
          this.projectService.fork({ nameGroup: group.id, idProject: this.appService.project.id }),
        ),
        switchMap((forkedProject: Project) =>
          // Mudar o nome do projeto (pois vai com o nome do template)
          this.editProject({ id: forkedProject.id, name: nameNewProject }),
        ),
        switchMap((editedProject: Project) =>
          // Remover o relacionamento com o projeto de template
          this.deleteForkRelationship({ id: editedProject.id }),
        ),
        catchError((error) => { throw error; }),
      );
    // this.projectService.fork({ nameGroup, idProject: this.appService.project.id })
    //   .pipe(
    //     switchMap((forkedProject: Project) =>
    //       // Mudar o nome do projeto (pois vai com o nome do template)
    //       this.editProject({ id: forkedProject.id, name: nameNewProject }),
    //     ),
    //     switchMap((editedProject: Project) =>
    //       // Remover o relacionamento com o projeto de template
    //       this.deleteForkRelationship({ id: editedProject.id }),
    //     ),
    //     catchError((error) => { throw error; }),
    //   );

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
