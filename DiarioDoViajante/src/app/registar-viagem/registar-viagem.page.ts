import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Storage } from '@ionic/storage-angular';

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
  transportes: string[] = []; // array para vários transportes

  viagens: Viagem[] = []; // Array para guardar as viagens
  private _storage: Storage | null = null;

  constructor(private storage: Storage, private location: Location) {}

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
    const novaViagem: Viagem = {
      destino: this.destino,
      percurso: this.percurso,
      preco: this.preco,
      transportes: this.transportes
    };
    this.viagens.push(novaViagem);
    await this._storage?.set('viagens', this.viagens);
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
          alert('Ficheiro inválido!');
        }
      } catch {
        alert('Erro ao ler ficheiro!');
      }
    };
    reader.readAsText(file);
  }
}

