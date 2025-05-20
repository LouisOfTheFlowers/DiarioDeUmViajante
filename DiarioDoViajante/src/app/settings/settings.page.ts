import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage {
  darkMode = false;
  mobileData = '';
  language = '';

  toggleDarkMode() {
    document.body.classList.toggle('dark', this.darkMode);
  }


}
