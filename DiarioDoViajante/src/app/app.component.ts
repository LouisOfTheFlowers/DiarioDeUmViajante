import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    this.initializeApp();

    const saved = localStorage.getItem('darkMode') === 'true';
    if (saved) {
      document.body.classList.add('dark-theme');
    }
  }

  initializeApp() {
    this.translate.addLangs(['pt', 'en', 'es']);
    this.translate.setDefaultLang('pt');
    const lang = localStorage.getItem('lang') || 'pt';
    this.translate.use(lang);
  }
}
