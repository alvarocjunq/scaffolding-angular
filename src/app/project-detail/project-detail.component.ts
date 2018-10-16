import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Details, Detail } from '../models/detail';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent implements OnInit {

  details: Details = [];

  constructor(private appService: AppService, private router: Router) { }

  ngOnInit() {
    const project = this.appService.project;
    Object.keys(project).map((key: string) => {
      this.details.push(new Detail(key, project[key]));
    });
  }

  home(e: Event) {
    e.stopPropagation();
    this.router.navigate(['/home']);
  }

}
