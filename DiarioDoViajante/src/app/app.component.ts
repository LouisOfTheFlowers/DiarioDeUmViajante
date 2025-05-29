import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor() {
    const saved = localStorage.getItem('darkMode') === 'true';
    if (saved) {
      document.body.classList.add('dark-theme');
    }
  }
}
