import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { Router } from '@angular/router';
import { File, Files } from '../models/file';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  files: Files;
  selectedTechnology: string;

  constructor(private homeService: HomeService,
              private router: Router) { }

  ngOnInit() {
    this.homeService.getTemplates().subscribe((files: Files) => {
      this.files = files;
    });
  }

  next(e: Event) {
    e.stopPropagation();
    this.homeService.setTemplateId(this.files, this.selectedTechnology);

    // TODO: Criar logica para montar o nome do novo projeto e substiruir o random abaixo
    this.router.navigate(['/more-info', Math.random()]);
  }

}
