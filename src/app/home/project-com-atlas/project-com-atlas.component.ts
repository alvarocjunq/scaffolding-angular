import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { HomeService } from '../home.service';
import { Files } from '../../.models/file';
import { Alert } from '../../.shared/alert';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-project-com-atlas',
  templateUrl: './project-com-atlas.component.html',
  styleUrls: ['./project-com-atlas.component.scss'],
})
export class ProjectComAtlasComponent implements OnInit, OnDestroy {

  projectForm = this.fb.group({
    acronimo: ['', Validators.required],
    capa: ['', Validators.required],
    sistema: ['', Validators.required],
    subsistema: ['', Validators.required],
    selectedTechnology: ['', Validators.required],
  });
  files: Files;
  nameNewProject: string;
  isWaiting = false; // TODO: emitir para o componente pai
  private unsubscribe: Subject<void> = new Subject();

  constructor(private homeService: HomeService,
    private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.homeService.getTemplates().pipe(takeUntil(this.unsubscribe))
      .subscribe(files => this.files = files);
  }

  generate() {
    const valueForm = this.projectForm.value;
    this.nameNewProject = this.getNameNewProject(valueForm);
    this.homeService.setTemplateId(this.files, valueForm.selectedTechnology);
    this.forkProject(valueForm);
  }

  private getNameNewProject(valueForm: any): string {
    // TODO: Implementar lógica para montar o nome do projeto
    return `${valueForm.acronimo}`;
  }
  private forkProject(valueForm: any) {
    this.isWaiting = true;
    this.homeService.forkProject(valueForm, this.nameNewProject)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        Alert.success(`Projeto <b>${this.nameNewProject}</b> gerado com sucesso`);
        this.router.navigate(['/detail']);
      },
      (err) => {
        this.isWaiting = false;
        Alert.error(`Projeto <b>${this.nameNewProject}</b> não gerado<br><br>${err.status} - ${JSON.stringify(err.error)}`);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
