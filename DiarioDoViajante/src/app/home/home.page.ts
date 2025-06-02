import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core'; // <-- Adiciona isto

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  loginForm!: FormGroup; // <-- Reactive Form

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private storage: Storage,
    private toastCtrl: ToastController,
    private translate: TranslateService // <-- Adiciona isto
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async login() {
    if (this.loginForm.invalid) {
      const toast = await this.toastCtrl.create({
        message: this.translate.instant('LOGIN.FILL_ALL_FIELDS'),
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    const { username, password } = this.loginForm.value;
    const users = await this.storage.get('users') || [];

    const userFound = users.find((u: any) =>
      u.username.trim().toLowerCase() === username.trim().toLowerCase() &&
      u.password === password
    );

    if (userFound) {
      // Atualiza o utilizador atual no Storage
      await this.storage.set('currentUser', userFound);

      const toast = await this.toastCtrl.create({
        message: 'Login efetuado com sucesso!',
        duration: 150,
        color: 'success'
      });
      await toast.present();

      toast.onDidDismiss().then(() => {
        this.router.navigateByUrl('/dashboard');
      });
    } else {
      const toast = await this.toastCtrl.create({
        message: this.translate.instant('LOGIN.INVALID_CREDENTIALS'),
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  irParaRegisto() {
    this.router.navigateByUrl('/registo');
  }
}