import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  email: string = '';
  password: string = '';

  constructor(private navCtrl: NavController, private alertCtrl: AlertController) {}
  async login() {
    const validEmail = 'viagante@gmail.com';
    const validPassword = '123';

    if (this.email === validEmail && this.password === validPassword) {
      this.navCtrl.navigateForward('/dashboard'); 
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Erro',
        message: 'Credenciais inválidas',
        buttons: ['OK']
      });
      await alert.present();
    }
}
}
