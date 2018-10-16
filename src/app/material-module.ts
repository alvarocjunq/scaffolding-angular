import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
    imports: [
        MatToolbarModule,
        MatFormFieldModule,
        MatGridListModule,
        MatButtonModule,
        MatSelectModule,
        MatInputModule,
    ],
    exports: [
        MatToolbarModule,
        MatFormFieldModule,
        MatGridListModule,
        MatButtonModule,
        MatSelectModule,
        MatInputModule,
    ],
})
export class MaterialModule { }
