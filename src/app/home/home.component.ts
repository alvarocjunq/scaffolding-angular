import { Component, OnInit, OnDestroy } from '@angular/core';
import { HomeService } from './home.service';
import { Router } from '@angular/router';
import { Files } from '../models/file';
import sweetalert2 from 'sweetalert2';
import { Group, Groups } from '../models/group';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Project } from '../models/project';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/internal/Subject';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  files: Files;
  selectedTechnology: string;

  groups: Groups;
  selectedGroup: Group;

  nameNewProject: string;
  private unsubscribe: Subject<void> = new Subject();

  constructor(private homeService: HomeService,
    private router: Router) { }

  ngOnInit() {
    this.homeService.getTemplates()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((files: Files) => {
        this.files = files;
      });

    this.homeService.getGroups()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((groups: Group[]) => {
        this.groups = groups;
      });
  }

  generate(e: Event) {
    e.stopPropagation();
    if (!this.isValid()) {
      sweetalert2('Erro', 'Todos os campos com * são de preenchimento obrigatório', 'error');
      return;
    }
    this.nameNewProject = this.getNameNewProject();
    this.homeService.setTemplateId(this.files, this.selectedTechnology);
    this.forkProject();
  }

  private getNameNewProject(): string {
    // Implementar lógica para montar o nome do projeto
    return `${Math.random()}`;
  }
  private forkProject() {
    // Criar o projeto
    this.homeService.forkProject({ nameGroup: this.selectedGroup.name })
      .pipe(
        switchMap((project: Project) =>
          // Mudar o nome do projeto (pois vai com o nome do template)
          this.homeService.editProject({ id: project.id, name: this.nameNewProject }),
        ),
        switchMap((project2: Project) =>
          // Remover o relacionamento com o projeto de template
          this.homeService.deleteForkRelationship({ id: project2.id }),
        ),
        takeUntil(this.unsubscribe))
      .subscribe(() => {
        sweetalert2('Sucesso', `Projeto ${this.nameNewProject} gerado com sucesso`, 'success');
        this.router.navigate(['/detail']);
      }, (res: HttpErrorResponse) => {
        const message = `Projeto ${this.nameNewProject} não gerado<br>${res.status} - ${res.error.message.name[0]}`;
        sweetalert2('Erro', message, 'error');
      });
  }

  private isValid(): boolean {
    if (!this.selectedTechnology) {
      return false;
    }
    if (!this.selectedGroup) {
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
