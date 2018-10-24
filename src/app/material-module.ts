import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';

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
        MatProgressBarModule,
        MatRadioModule,
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
        MatProgressBarModule,
        MatRadioModule,
    ],
})
export class MaterialModule { }
