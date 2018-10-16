import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { HomeService } from './home.service';
import { MaterialModule } from '../material-module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '',  component: HomeComponent },
];

@NgModule({
  imports: [
    MaterialModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [HomeComponent],
  providers: [HomeService],
  exports: [HomeComponent],
})
export class HomeModule { }
