import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage implements OnInit {
  darkMode = false;
  mobileData = '';
  language = '';
  traducao = '';
  selectedLang: string = 'pt';

  constructor(
  private translate: TranslateService
) {}

  toggleDarkMode(event: any) {
    const isDark = event.detail.checked;
    document.body.classList.toggle('dark-theme', isDark);
    localStorage.setItem('darkMode', isDark ? 'true' : 'false');
  }

  ngOnInit() {
    const saved = localStorage.getItem('darkMode') === 'true';
    this.darkMode = saved;
    if (saved) {
      document.body.classList.add('dark-theme');
    }
    const lang = localStorage.getItem('lang') || 'pt';
    this.selectedLang = lang;
    this.translate.use(lang); // <-- força o ngx-translate a usar o idioma guardado
    const mobileData = localStorage.getItem('mobileData') || '';
    this.mobileData = mobileData;
  }

  trocarIdioma(novoIdioma: string) {
  if (!novoIdioma) return;
  this.translate.use(novoIdioma);
}

changeLang(lang: string) {
  this.selectedLang = lang;
  this.translate.use(lang);
  localStorage.setItem('lang', lang);
}

changeMobileData(value: string) {
  this.mobileData = value;
  localStorage.setItem('mobileData', value);
}
}
