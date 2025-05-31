import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // <-- Importar
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { TranslateService } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  
  selector: 'app-registo',
  templateUrl: './registo.page.html',
  styleUrls: ['./registo.page.scss'],
  standalone: false,
})
export class RegistoPage implements OnInit {
  registoForm!: FormGroup;  // <-- Reactive Form
  darkMode = false;
  linguaSelecionada = 'pt';

  constructor(
    private fb: FormBuilder, // <-- FormBuilder
    private alertCtrl: AlertController,
    private router: Router,
    private translate: TranslateService,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.createForm();

    const saved = localStorage.getItem('darkMode') === 'true';
    this.darkMode = saved;
    if (saved) {
      document.body.classList.add('dark-theme');
    }

    const lang = localStorage.getItem('lang') || 'pt';
  this.linguaSelecionada = lang;
  this.translate.use(lang);
  }

  createForm() {
    this.registoForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  async registar() {
    if (this.registoForm.invalid) {
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('ERRO'),
        message: this.translate.instant('PREENCHA_TODOS_OS_CAMPOS'),
        buttons: [this.translate.instant('OK')],
      });
      await alert.present();
      return;
    }

    const { username, email, password, confirmPassword } = this.registoForm.value;

    if (password !== confirmPassword) {
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('ERRO'),
        message: this.translate.instant('Passwords_Nao_Coincidem'),
        buttons: [this.translate.instant('OK')],
      });
      await alert.present();
      return;
    }

    const user = { username, email, password };
    const users = await this.storage.get('users') || [];
    users.push(user);
    await this.storage.set('users', users);

    this.generateTxt(users);

    const alert = await this.alertCtrl.create({
      header: this.translate.instant('SUCESSO'),
      message: this.translate.instant('CONTA_CRIADA_SUCESSO'),
      buttons: [this.translate.instant('OK')],
    });
    await alert.present();

    this.router.navigate(['/home']);
  }

  generateTxt(users: any[]) {
    const content = users.map(u => `Username: ${u.username}, Email: ${u.email}, Password: ${u.password}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.txt';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  toggleDarkMode(event: any) {
    const isDark = event.detail.checked;
    document.body.classList.toggle('dark-theme', isDark);
    localStorage.setItem('darkMode', isDark ? 'true' : 'false');
  }

  trocarIdioma(novoIdioma: string) {
    if (!novoIdioma) return;
    this.linguaSelecionada = novoIdioma;
    this.translate.use(novoIdioma);
    localStorage.setItem('lang', novoIdioma);
  }
}
