import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {
  username: string = '';

  constructor(private storage: Storage) { }

  async ngOnInit() {
    await this.storage.create();
    await this.loadUsername();
  }

  async ionViewWillEnter() {
    await this.loadUsername();
  }

  private async loadUsername() {
    const currentUser = await this.storage.get('currentUser');
    this.username = currentUser?.username || '';
  }
}
