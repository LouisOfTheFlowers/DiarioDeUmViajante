import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registar-avaliacao',
  templateUrl: './registar-avaliacao.page.html',
  styleUrls: ['./registar-avaliacao.page.scss'],
  standalone: false,
})
export class RegistarAvaliacaoPage {
  categoria: string = '';
  nome: string = '';
  comentario: string = '';
  rating: number = 0;
  foto: string | null = null;
  private _storage: Storage | null = null;

  constructor(private storage: Storage, private router: Router, private alertCtrl: AlertController) {}

  async ngOnInit() {
    this._storage = await this.storage.create();
  }

  setRating(star: number) {
    this.rating = star;
  }

  async escolherFoto() {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });
    this.foto = image.dataUrl ?? null;
  }

  async confirmarAvaliacao() {
    if (!this.categoria || !this.nome || !this.comentario || !this.rating) {
      const alert = await this.alertCtrl.create({
        header: 'Atenção',
        message: 'Tem de preencher todos os campos!',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Guarda a categoria como "restaurant" ou "hotel"
    let categoriaKey = this.categoria;
    if (categoriaKey.toLowerCase() === 'restaurante') {
      categoriaKey = 'restaurant';
    } else if (categoriaKey.toLowerCase() === 'hotel') {
      categoriaKey = 'hotel';
    }

    const novaAvaliacao = {
      categoria: categoriaKey,
      nome: this.nome,
      comentario: this.comentario,
      rating: this.rating,
      foto: this.foto,
      data: new Date().toISOString(),
    };
    const avaliacoes = (await this._storage?.get('avaliacoes')) || [];
    avaliacoes.push(novaAvaliacao);
    await this._storage?.set('avaliacoes', avaliacoes);
    this.router.navigate(['/avaliacoes']);
  }
}
