import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material-module';
import { HomeComponent } from './home.component';
import { HomeService } from './home.service';
import { ProjectComAtlasComponent } from './project-com-atlas/project-com-atlas.component';
import { ProjectSemAtlasComponent } from './project-sem-atlas/project-sem-atlas.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [HomeComponent, ProjectComAtlasComponent, ProjectSemAtlasComponent],
  providers: [HomeService],
  exports: [HomeComponent],
})
export class HomeModule { }
