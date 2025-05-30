import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';

interface Viagem {
  destino: string;
  percurso: string;
  preco: number | null;
  transportes: string[]; // array!
}

@Component({
  selector: 'app-registar-viagem',
  templateUrl: './registar-viagem.page.html',
  styleUrls: ['./registar-viagem.page.scss'],
  standalone: false,
})
export class RegistarViagemPage implements OnInit {

  destino: string = '';
  percurso: string = '';
  preco: number | null = null;
  transportes: string[] = [];

  viagens: Viagem[] = [];
  private _storage: Storage | null = null;

  constructor(
    private storage: Storage,
    private location: Location,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    this._storage = await this.storage.create();
    const viagensGuardadas = await this._storage.get('viagens');
    if (viagensGuardadas) {
      this.viagens = viagensGuardadas;
    }
  }

  ionViewWillEnter() {
    this.destino = '';
    this.percurso = '';
    this.preco = null;
    this.transportes = [];
  }

  async confirmarViagem() {
    // Verifica se todos os campos estão preenchidos
    if (
      !this.destino ||
      !this.percurso ||
      this.preco === null ||
      this.preco === undefined ||
      this.transportes.length === 0
    ) {
      const alert = await this.alertCtrl.create({
        header: 'Atenção',
        message: 'Tem de preencher todos os campos!',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const novaViagem: Viagem = {
      destino: this.destino,
      percurso: this.percurso,
      preco: this.preco,
      transportes: this.transportes
    };
    this.viagens.push(novaViagem);
    await this._storage?.set('viagens', this.viagens);
    await this.exportarViagens();

    this.destino = '';
    this.percurso = '';
    this.preco = null;
    this.transportes = [];
  }

  voltarAtras() {
    this.location.back();
  }

  async importarViagens(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e: any) => {
      try {
        const viagensImportadas = JSON.parse(e.target.result);
        if (Array.isArray(viagensImportadas)) {
          this.viagens = viagensImportadas;
          await this._storage?.set('viagens', this.viagens);
        } else {
          this.apresentarAlerta('Ficheiro inválido!');
        }
      } catch {
        this.apresentarAlerta('Erro ao ler ficheiro!');
      }
    };
    reader.readAsText(file);
  }

  async exportarViagens() {
    const viagens = await this._storage?.get('viagens') || [];
    const dataStr = JSON.stringify(viagens, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'viagens.json';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  private async apresentarAlerta(mensagem: string) {
    const alert = await this.alertCtrl.create({
      header: 'Atenção',
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }
}