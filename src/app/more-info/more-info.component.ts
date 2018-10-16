import { Component, OnInit } from '@angular/core';
import { MoreInfoService } from './more-info.service';
import { Group } from '../models/group';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Project } from '../models/project';
import sweetalert2 from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.component.html',
  styleUrls: ['./more-info.component.scss'],
})
export class MoreInfoComponent implements OnInit {

  groups: Group[];
  selectedGroup: Group;
  nameNewProject: string;

  constructor(private moreInfoService: MoreInfoService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.nameNewProject = this.route.snapshot.paramMap.get('nameNewProject');
    this.moreInfoService.getGroups().subscribe((groups: Group[]) => {
      this.groups = groups;
    });
  }

  generate() {
    this.moreInfoService.forkProject({ nameGroup: this.selectedGroup.name })
      .pipe(
        switchMap((project: Project) =>
          this.moreInfoService.editProject({ id: project.id, name: this.nameNewProject }),
        ),
        switchMap((project2: Project) =>
          this.moreInfoService.deleteForkRelationship({ id: project2.id }),
        ))
      .subscribe(() => {
        sweetalert2('Sucesso', `Projeto ${this.nameNewProject} gerado com sucesso`, 'success');
      }, (res: HttpErrorResponse) => {
        const message = `Projeto ${this.nameNewProject} não gerado<br>${res.status} - ${res.error.message.name[0]}`;
        sweetalert2('Erro', message, 'error');
      });
  }

  cancel() {
    this.router.navigate(['/home']);
  }

}
