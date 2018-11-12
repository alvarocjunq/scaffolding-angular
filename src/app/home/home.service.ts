import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { File, Files } from '../.models/file';
import { Group, Groups } from '../.models/group';
import { Project } from '../.models/project';
import { GroupService } from '../.services/group.service';
import { ProjectService } from '../.services/project.service';

import { ScaffoldingDetailService } from 'scaffolding-detail';
import { Commit } from '../.models/commit';

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
  forkProject(form: any, nameNewProject: string, files: Files) {
    return this.groupService.add(form.capa, form.capa)
      .pipe(
        switchMap(group => this.groupService.add(this.getNameGroupHierarchy(form, 1), form.sistema, group.id)),
        switchMap(group => this.groupService.add(this.getNameGroupHierarchy(form, 2), form.subsistema, group.id)),
        switchMap(group => this.groupService.add(this.getNameGroupHierarchy(form, 3), form.aplicacaoFuncional, group.id)),
        switchMap(group => this.groupService.add(this.getNameGroupHierarchy(form, 4), form.servicoFuncional, group.id)),
        switchMap(group => this.fork(group, nameNewProject, files, form.selectedTechnology)),
      );
  }

  forkSingleProject(valueForm: any, nameNewProject: string, files: Files) {
    return this.fork(valueForm.selectedGroup, nameNewProject, files, valueForm.selectedTechnology);
  }

  private updateFiles(idProject: string, nameNewProject: string): Observable<{}> {

    const packageJson = 'package.json';
    const angularJson = 'angular.json';

    return forkJoin([
      this.projectService.getFileContent(idProject, packageJson),
      this.projectService.getFileContent(idProject, angularJson),
    ], (_packageJson: File, _angularJson: File) => {
      return {
        packageContent: _packageJson.content,
        angularContent: _angularJson.content,
      };
    }).pipe(
      map((obj: any) => {
        obj.packageContent = this.replaceAllNames(obj.packageContent, nameNewProject);
        obj.angularContent = this.replaceAllNames(obj.angularContent, nameNewProject);
        return obj;
      }),
      switchMap((obj: any) => {
        const commit: Commit = {
          branch: 'master',
          commit_message: 'initial commit',
          actions: [
            {
              action: 'update',
              content: btoa(obj.packageContent),
              encoding: 'base64',
              file_path: packageJson,
            },
            {
              action: 'update',
              content: btoa(obj.angularContent),
              encoding: 'base64',
              file_path: angularJson,
            }],
        };
        return this.projectService.updateFile(idProject, commit);
      }),
    );
  }

  private replaceAllNames(str: string, replaceValue: string) {
    return str
      .replace(new RegExp('PROJETO-BASE', 'g'), replaceValue)
      .replace(new RegExp('projeto-base', 'g'), replaceValue);
  }

  private getNameGroupHierarchy(form: any, level: number) {
    let str = '';
    const fields: string[] = [
      form.capa,
      form.sistema,
      form.subsistema,
      form.aplicacaoFuncional,
      form.servicoFuncional,
    ];
    for (let i = 0, len = fields.length; i <= len; i += 1) {
      str += fields[i];
      if (i === level) {
        break;
      }
      str += '/';
    }
    return str;
  }

  private fork(group: Group, nameNewProject: string, files: Files, technology: string) {
    this.setTemplateId(files, technology);
    return this.projectService.fork({ nameGroup: group.id, idProject: this.detailService.project.id })
      .pipe(
        switchMap(forkedProject => this.editProject({ id: forkedProject.id, name: nameNewProject })),
        switchMap((editedProject: Project) => {
          return forkJoin([
            this.deleteForkRelationship({ id: editedProject.id }),
            this.updateFiles(editedProject.id, nameNewProject),
          ]);
        }),
      );
  }

  private editProject({ id, name }): Observable<Project> {
    return this.projectService.edit({ name, idProject: id })
      .pipe(
        map((project: Project) => {
          this.detailService.project.http_url_to_repo = project.http_url_to_repo;
          return project;
        }));
  }

  private deleteForkRelationship({ id }) {
    return this.projectService.deleteFork({ idProject: id });
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
