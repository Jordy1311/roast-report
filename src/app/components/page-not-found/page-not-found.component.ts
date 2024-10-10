import { Component } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [],
  styleUrl: './page-not-found.component.scss',
  template: `
    <main>
      <h1>Page not found!</h1>
      <p>Sorry!! We could not find that page or it does not exist.</p>
    </main>
  `,
})
export class PageNotFoundComponent {}
