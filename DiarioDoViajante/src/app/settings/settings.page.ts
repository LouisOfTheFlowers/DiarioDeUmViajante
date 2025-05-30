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
  }

  trocarIdioma(novoIdioma: string) {
  if (!novoIdioma) return;
  this.translate.use(novoIdioma);
}
}
