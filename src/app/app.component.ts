import { Component } from '@angular/core';

import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ LoginComponent ],
  styleUrl: './app.component.css',
  template: `
    <login></login>
  `,
})
export class AppComponent {

}
