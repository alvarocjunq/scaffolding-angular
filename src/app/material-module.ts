import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@NgModule({
    imports: [
        MatToolbarModule,
        MatFormFieldModule,
        MatGridListModule,
        MatButtonModule,
        MatSelectModule,
        MatInputModule,
        MatListModule,
        MatIconModule,
    ],
    exports: [
        MatToolbarModule,
        MatFormFieldModule,
        MatGridListModule,
        MatButtonModule,
        MatSelectModule,
        MatInputModule,
        MatListModule,
        MatIconModule,
    ],
})
export class MaterialModule { }
