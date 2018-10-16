import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const ROUTES: Routes = [
    // { path: 'more-info/:nameNewProject', loadChildren: './more-info/more-info.module#MoreInfoModule' },
    { path: 'home', loadChildren: './home/home.module#HomeModule' },
    { path: 'detail', loadChildren: './project-detail/project-detail.module#ProjectDetailModule' },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(ROUTES)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
