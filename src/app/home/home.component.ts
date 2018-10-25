import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  preserveWhitespaces: false,
})
export class HomeComponent {

  isWaiting = false;
  optionAtlas = 'com';

  constructor() { }

  toggleWaiting(isWaiting: boolean): void {
    this.isWaiting = isWaiting;
  }
}
