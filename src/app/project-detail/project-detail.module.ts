import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectDetailComponent } from './project-detail.component';
import { MaterialModule } from '../material-module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ProjectDetailComponent },
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ProjectDetailComponent],
})
export class ProjectDetailModule { }
