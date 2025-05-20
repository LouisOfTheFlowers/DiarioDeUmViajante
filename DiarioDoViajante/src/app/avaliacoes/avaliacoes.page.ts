import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-avaliacoes',
  templateUrl: './avaliacoes.page.html',
  styleUrls: ['./avaliacoes.page.scss'],
  standalone: false
})
export class AvaliacoesPage {
  restauranteRating = 3;
  hotelRating = 3;
  filter: 'all' | 'restaurante' | 'hotel' = 'all';

  constructor(private actionSheetCtrl: ActionSheetController) {}

  setRestauranteRating(rating: number) {
    this.restauranteRating = rating;
  }

  setHotelRating(rating: number) {
    this.hotelRating = rating;
  }

  async openFilter() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Filtrar por',
      buttons: [
        {
          text: 'Todos',
          handler: () => { this.filter = 'all'; }
        },
        {
          text: 'Restaurante',
          handler: () => { this.filter = 'restaurante'; }
        },
        {
          text: 'Hotel',
          handler: () => { this.filter = 'hotel'; }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }
}