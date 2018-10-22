import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { HomeService } from './home.service';
import { Files } from '../.models/file';
import { Groups } from '../.models/group';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { Alert } from '../.shared/alert';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  projectForm = this.fb.group({
    acronimo: ['', Validators.required],
    capa: ['', Validators.required],
    sistema: ['', Validators.required],
    subsistema: ['', Validators.required],
    selectedTechnology: ['', Validators.required],
    selectedGroup: ['', Validators.required],
  });

  files: Files;
  groups: Groups;
  nameNewProject: string;
  isWaiting = false;
  private unsubscribe: Subject<void> = new Subject();

  constructor(private homeService: HomeService,
    private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.homeService.getTemplates().pipe(takeUntil(this.unsubscribe))
      .subscribe(files => this.files = files);

    this.homeService.getGroups().pipe(takeUntil(this.unsubscribe))
      .subscribe(groups => this.groups = groups);
  }

  generate() {
    const valueForm = this.projectForm.value;
    this.nameNewProject = this.getNameNewProject(valueForm);
    this.homeService.setTemplateId(this.files, valueForm.selectedTechnology);
    this.forkProject(valueForm);
  }

  // TODO: Implementar lógica para montar o nome do projeto
  private getNameNewProject(valueForm: any): string {
    return `${valueForm.acronimo}`;
  }
  private forkProject(valueForm: any) {
    this.isWaiting = true;
    this.homeService.forkProject(valueForm, this.nameNewProject)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        Alert.success(`Projeto ${this.nameNewProject} gerado com sucesso`);
        this.router.navigate(['/detail']);
      }, (err) => {
          this.isWaiting = false;
          Alert.error(`Projeto <b>${this.nameNewProject}</b> não gerado<br><br>${err.status} - ${JSON.stringify(err.error)}`);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
