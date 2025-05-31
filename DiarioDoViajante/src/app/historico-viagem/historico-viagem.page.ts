import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { TranslateService } from '@ngx-translate/core';

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
    private storage: Storage,
    private translate: TranslateService
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
    const confirmMsg = this.translate.instant('HISTORICO_VIAGENS.CONFIRM_DELETE');
    if (confirm(confirmMsg)) {
      this.viagens.splice(index, 1);
      await this._storage?.set('viagens', this.viagens);
    }
  }

  async abrirFiltro() {
    const header = this.translate.instant('HISTORICO_VIAGENS.FILTER_HEADER');
    const btnNone = this.translate.instant('HISTORICO_VIAGENS.FILTER_NONE');
    const btnAsc = this.translate.instant('HISTORICO_VIAGENS.FILTER_PRICE_ASC');
    const btnDesc = this.translate.instant('HISTORICO_VIAGENS.FILTER_PRICE_DESC');
    const btnRecent = this.translate.instant('HISTORICO_VIAGENS.FILTER_MOST_RECENT');
    const btnOld = this.translate.instant('HISTORICO_VIAGENS.FILTER_OLDEST');
    const btnCancel = this.translate.instant('HISTORICO_VIAGENS.FILTER_CANCEL');

    const actionSheet = await this.actionSheetCtrl.create({
      header,
      buttons: [
        {
          text: btnNone,
          handler: () => { this.precoFiltro = 'nenhum'; }
        },
        {
          text: btnAsc,
          handler: () => { this.precoFiltro = 'asc'; }
        },
        {
          text: btnDesc,
          handler: () => { this.precoFiltro = 'desc'; }
        },
        {
          text: btnRecent,
          handler: () => { this.precoFiltro = 'maisRecente'; }
        },
        {
          text: btnOld,
          handler: () => { this.precoFiltro = 'maisAntigo'; }
        },
        {
          text: btnCancel,
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
          alert(this.translate.instant('HISTORICO_VIAGENS.INVALID_FILE'));
        }
      } catch {
        alert(this.translate.instant('HISTORICO_VIAGENS.READ_ERROR'));
      }
    };
    reader.readAsText(file);
  }
}
