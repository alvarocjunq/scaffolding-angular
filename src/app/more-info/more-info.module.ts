import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MoreInfoComponent } from './more-info.component';
import { MoreInfoService } from './more-info.service';
import { MaterialModule } from '../material-module';

const routes: Routes = [
  { path: '', component: MoreInfoComponent },
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  providers: [MoreInfoService],
  declarations: [MoreInfoComponent],
  exports: [MoreInfoComponent],
})
export class MoreInfoModule { }
