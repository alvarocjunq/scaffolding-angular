import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Files } from '../../.models/file';
import { Alert } from '../../.shared/alert';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-project-com-atlas',
  templateUrl: './project-com-atlas.component.html',
  styleUrls: ['./project-com-atlas.component.scss'],
})
export class ProjectComAtlasComponent implements OnInit, OnDestroy {

  @Output()
  isWaiting = new EventEmitter();

  projectForm = this.fb.group({
    acronimo: ['', Validators.required],
    capa: ['', Validators.required],
    sistema: ['', Validators.required],
    subsistema: ['', Validators.required],
    selectedTechnology: ['', Validators.required],
    aplicacaoFuncional: ['', Validators.required],
    servicoFuncional: ['', Validators.required],
  });
  files: Files;
  private nameNewProject: string;
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
    this.forkProject(valueForm);
  }

  private getNameNewProject(valueForm: any): string {
    // TODO: Implementar lógica para montar o nome do projeto
    return `${valueForm.acronimo}`;
  }
  private forkProject(valueForm: any) {
    this.isWaiting.emit(true);

    this.homeService.forkProject(valueForm, this.nameNewProject, this.files)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        Alert.success(`Projeto <b>${this.nameNewProject}</b> gerado com sucesso`);
        this.router.navigate(['/detail']);
      },
      (err) => {
        this.isWaiting.emit(false);
        Alert.error(`Projeto <b>${this.nameNewProject}</b> não gerado<br><br>${err.status} - ${JSON.stringify(err.error)}`);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
