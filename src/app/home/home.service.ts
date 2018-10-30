import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { File, Files } from '../.models/file';
import { Group, Groups } from '../.models/group';
import { Project } from '../.models/project';
import { GroupService } from '../.services/group.service';
import { ProjectService } from '../.services/project.service';
// import { AppService } from '../app.service';

import { ScaffoldingDetailService } from 'scaffolding-detail';

@Injectable()
export class HomeService {

  private readonly ID_REPOSITORY_TEMPLATE = '8886084';
  cachedGroups: Groups;
  cachedTemplates: Files;

  constructor(private detailService: ScaffoldingDetailService,
    private groupService: GroupService,
    private projectService: ProjectService) { }

  getTemplates(): Observable<Files> {

    if (this.cachedTemplates) {
      return of(this.cachedTemplates);
    }

    return this.projectService.getArchives(this.ID_REPOSITORY_TEMPLATE)
      .pipe(
        map((files: Files) => {
          files.forEach(file => file.technology = this.getStrDash(file.name));
          this.cachedTemplates = files;
          return files;
        }),
      );
  }

  getGroups(): Observable<Groups> {
    if (this.cachedGroups) {
      return of(this.cachedGroups);
    }
    return this.groupService.getAll().pipe(map(groups => this.cachedGroups = groups));
  }

  // TODO: verificar se cada criação de grupo existe antes de tentar criar, senão dá erro
  forkProject(valueForm: any, nameNewProject: string, files: Files) {
    return this.groupService.add(valueForm.capa)
      .pipe(
        switchMap(group => this.groupService.add(valueForm.sistema, group.id)),
        switchMap(group => this.groupService.add(valueForm.subsistema, group.id)),
        switchMap(group => this.groupService.add(valueForm.aplicacaoFuncional, group.id)),
        switchMap(group => this.groupService.add(valueForm.servicoFuncional, group.id)),
        switchMap(group => this.fork(group, nameNewProject, files, valueForm.selectedTechnology)),
      );
  }

  forkSingleProject(valueForm: any, nameNewProject: string, files: Files) {
    return this.fork(valueForm.selectedGroup, nameNewProject, files, valueForm.selectedTechnology);
  }

  private fork(group: Group, nameNewProject: string, files: Files, technology: string) {
    this.setTemplateId(files, technology);
    return this.projectService.fork({ nameGroup: group.id, idProject: this.detailService.project.id })
      .pipe(
        switchMap(forkedProject => this.editProject({ id: forkedProject.id, name: nameNewProject })),
        switchMap((editedProject: Project) => this.deleteForkRelationship({ id: editedProject.id })),
      );
  }

  private editProject({ id, name }): Observable<Project> {
    return this.projectService.edit({ id, name })
      .pipe(
        map((project: Project) => {
          this.detailService.project.http_url_to_repo = project.http_url_to_repo;
          return project;
        }));
  }

  private deleteForkRelationship({ id }) {
    return this.projectService.deleteFork({ id });
  }

  private setTemplateId(files: Files, selectedType: string): void {
    let fileName = files.find((file: File) => {
      return this.getStrDash(file.name) === selectedType;
    }).name;

    fileName = fileName.split('-').reverse().join('-');
    this.detailService.project.id = this.getStrDash(fileName);
  }

  private getStrDash(str: string): string {
    return str.substr(0, str.indexOf('-'));
  }
}
