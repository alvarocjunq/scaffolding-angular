import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { Router } from '@angular/router';
import { Files } from '../models/file';
import sweetalert2 from 'sweetalert2';
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

  private isValid(): boolean {
    if (!this.selectedTechnology) {
      return false;
    }
    return true;
  }

  next(e: Event) {
    e.stopPropagation();
    if (!this.isValid()) {
      sweetalert2('Erro', 'Todos os campos com * são de preenchimento obrigatório', 'error');
      return;
    }
    this.homeService.setTemplateId(this.files, this.selectedTechnology);

    // TODO: Criar logica para montar o nome do novo projeto e substiruir o random abaixo
    this.router.navigate(['/more-info', Math.random()]);
  }

}
