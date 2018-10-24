import { Component, OnInit, OnDestroy } from '@angular/core';
import { Groups } from 'src/app/.models/group';
import { HomeService } from '../home.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { Alert } from '../../.shared/alert';
import { Router } from '@angular/router';
import { Files } from 'src/app/.models/file';

@Component({
  selector: 'app-project-sem-atlas',
  templateUrl: './project-sem-atlas.component.html',
  styleUrls: ['./project-sem-atlas.component.scss'],
})
export class ProjectSemAtlasComponent implements OnInit, OnDestroy {

  projectForm = this.fb.group({
    acronimo: ['', Validators.required],
    selectedGroup: ['', Validators.required],
    selectedTechnology: ['', Validators.required],
  });
  nameNewProject: string;
  groups: Groups;
  files: Files;
  isWaiting = false; // TODO: emitir para o componente pai
  private unsubscribe: Subject<void> = new Subject();

  constructor(private homeService: HomeService, private fb: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.homeService.getGroups().pipe(takeUntil(this.unsubscribe))
      .subscribe(groups => this.groups = groups);

    this.homeService.getTemplates().pipe(takeUntil(this.unsubscribe))
      .subscribe(files => this.files = files);
  }

  private getNameNewProject(valueForm: any): string {
    // TODO: Implementar lógica para montar o nome do projeto
    return `${valueForm.acronimo}`;
  }

  generate() {
    const form = this.projectForm.value;
    this.nameNewProject = this.getNameNewProject(form);
    this.homeService.setTemplateId(this.files, form.selectedTechnology);
    this.homeService.forkSingleProject(form, this.nameNewProject)
      .subscribe(() => {
        Alert.success(`Projeto <b>${this.nameNewProject}</b> gerado com sucesso`);
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
