import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registo',
  templateUrl: './registo.page.html',
  styleUrls: ['./registo.page.scss'],
  standalone: false,
})
export class RegistoPage {
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private alertCtrl: AlertController, private router: Router) {}

  async registar() {
    if (this.password !== this.confirmPassword) {
      const alert = await this.alertCtrl.create({
        header: 'Erro',
        message: 'As passwords não coincidem.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Sucesso',
      message: `Conta criada com sucesso!`,
      buttons: ['OK'],
    });
    await alert.present();

    this.router.navigate(['/home']);
  }

darkMode = false;
linguaSelecionada = 'pt';

toggleTheme() {
  document.body.classList.toggle('dark', this.darkMode);
}

}
