import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  options: FormGroup;

  constructor(fb: FormBuilder) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  private teste() {
    let numero = 1;
    let i = 1;
    for (i = 0; (i < 9 || i === 7); i += 1) {
      const index = 8;
      if (numero) {
        numero += 1;
      } else {
        numero -= 1;
      }
    }
    console.log(numero);
  }
}
