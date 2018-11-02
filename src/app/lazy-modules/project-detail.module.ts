import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from '../material-module';

import { ScaffoldingDetailModule, ScaffoldingDetailComponent } from 'scaffolding-detail';

const routes: Routes = [
  { path: '', component: ScaffoldingDetailComponent },
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ScaffoldingDetailModule,
    RouterModule.forChild(routes),
  ],
  declarations: [],
})
export class ProjectDetailModule { }
