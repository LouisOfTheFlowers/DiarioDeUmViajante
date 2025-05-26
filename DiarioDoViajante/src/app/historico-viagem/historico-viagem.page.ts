import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

interface Viagem {
  destino: string;
  percurso: string;
  preco: number | null;
  transportes: string[];
}

@Component({
  selector: 'app-historico-viagem',
  templateUrl: './historico-viagem.page.html',
  styleUrls: ['./historico-viagem.page.scss'],
  standalone: false,
})
export class HistoricoViagemPage implements OnInit {
  viagens: Viagem[] = [];
  searchTerm: string = '';
  precoFiltro: 'nenhum' | 'asc' | 'desc' | 'maisRecente' | 'maisAntigo' = 'nenhum';
  private _storage: Storage | null = null;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private storage: Storage
  ) {}

  async ngOnInit() {
    this._storage = await this.storage.create();
    await this.carregarViagens();
  }

  async ionViewWillEnter() {
    await this.carregarViagens();
  }

  async carregarViagens() {
    const viagensGuardadas = await this._storage?.get('viagens');
    if (viagensGuardadas) {
      this.viagens = viagensGuardadas;
    } else {
      this.viagens = [];
    }
  }

  async eliminarViagem(index: number) {
    if (confirm('Tem a certeza que deseja eliminar esta viagem?')) {
      this.viagens.splice(index, 1);
      await this._storage?.set('viagens', this.viagens);
    }
  }

  async abrirFiltro() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Ordenar/Filtar viagens',
      buttons: [
        {
          text: 'Nenhum',
          handler: () => { this.precoFiltro = 'nenhum'; }
        },
        {
          text: 'Preço ↑',
          handler: () => { this.precoFiltro = 'asc'; }
        },
        {
          text: 'Preço ↓',
          handler: () => { this.precoFiltro = 'desc'; }
        },
        {
          text: 'Mais recente',
          handler: () => { this.precoFiltro = 'maisRecente'; }
        },
        {
          text: 'Mais antigo',
          handler: () => { this.precoFiltro = 'maisAntigo'; }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  get viagensFiltradas() {
    let filtradas = this.viagens;

    // Pesquisa por destino
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      filtradas = filtradas.filter(v =>
        v.destino.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filtros
    if (this.precoFiltro === 'asc') {
      filtradas = [...filtradas].sort((a, b) => (a.preco ?? 0) - (b.preco ?? 0));
    } else if (this.precoFiltro === 'desc') {
      filtradas = [...filtradas].sort((a, b) => (b.preco ?? 0) - (a.preco ?? 0));
    } else if (this.precoFiltro === 'maisRecente') {
      filtradas = [...filtradas].reverse();
    } else if (this.precoFiltro === 'maisAntigo') {
      filtradas = [...filtradas];
    }

    return filtradas;
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
