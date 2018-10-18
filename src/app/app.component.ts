import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    window.addEventListener('message', receiveMessage, false);
    function receiveMessage(event) {
      console.log(event);
    }
    // console.log(window.name);
  }

}
