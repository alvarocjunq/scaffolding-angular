import { Component, OnInit, OnDestroy } from '@angular/core';
import { HomeService } from './home.service';
import { Router } from '@angular/router';
import { Files } from '../.models/file';
import sweetalert2 from 'sweetalert2';
import { Group, Groups } from '../.models/group';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/internal/Subject';
import { Alert } from '../.shared/alert';
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
  isWaiting = false;
  private unsubscribe: Subject<void> = new Subject();

  constructor(private homeService: HomeService,
    private router: Router) { }

  ngOnInit() {
    this.homeService.getTemplates().pipe(takeUntil(this.unsubscribe))
      .subscribe(files => this.files = files);

    this.homeService.getGroups().pipe(takeUntil(this.unsubscribe))
      .subscribe(groups => this.groups = groups);
  }

  generate(e: Event) {
    e.stopPropagation();
    if (!this.isValid()) {
      Alert.error('Todos os campos com * são de preenchimento obrigatório');
      return;
    }
    this.nameNewProject = this.getNameNewProject();
    this.homeService.setTemplateId(this.files, this.selectedTechnology);
    this.forkProject();
  }

  // TODO: Implementar lógica para montar o nome do projeto
  private getNameNewProject(): string {
    return `${Math.random()}`;
  }
  private forkProject() {
    this.isWaiting = true;
    // Criar o projeto
    this.homeService.forkProject({
      nameGroup: this.selectedGroup.name,
      nameNewProject: this.nameNewProject,
    })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        Alert.success(`Projeto ${this.nameNewProject} gerado com sucesso`);
        this.router.navigate(['/detail']);
      }, (res: HttpErrorResponse) => {
        this.isWaiting = false;
        Alert.error(`Projeto ${this.nameNewProject} não gerado<br><br>${res.status} - ${JSON.stringify(res.error)}`);
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
