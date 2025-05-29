import { Component, OnInit } from '@angular/core';

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
}
