import { Component } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

interface Avaliacao {
  categoria: string;
  nome: string;
  comentario: string;
  rating: number;
  foto?: string | null;
  data: string;
}

@Component({
  selector: 'app-avaliacoes',
  templateUrl: './avaliacoes.page.html',
  styleUrls: ['./avaliacoes.page.scss'],
  standalone: false
})
export class AvaliacoesPage {
  avaliacoes: Avaliacao[] = [];
  searchTerm: string = '';
  filter: 'all' | 'restaurant' | 'hotel' = 'all';

  private _storage: Storage | null = null;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private storage: Storage,
    private alertCtrl: AlertController,
    private translate: TranslateService
  ) {
  this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    console.log('Idioma mudado para:', event.lang);
  });
}

  async ngOnInit() {
    this._storage = await this.storage.create();
    await this.carregarAvaliacoes();
  }

  async ionViewWillEnter() {
    await this.carregarAvaliacoes();
  }

  private async carregarAvaliacoes() {
    let avaliacoesGuardadas = await this._storage?.get('avaliacoes');
    if (avaliacoesGuardadas) {
      // Corrige categorias antigas
      avaliacoesGuardadas = avaliacoesGuardadas.map((a: Avaliacao) => {
        if (a.categoria?.toLowerCase() === 'restaurante') {
          a.categoria = 'restaurant';
        } else if (a.categoria?.toLowerCase() === 'hotel') {
          a.categoria = 'hotel';
        }
        return a;
      });
      this.avaliacoes = avaliacoesGuardadas;
      await this._storage?.set('avaliacoes', avaliacoesGuardadas); // Atualiza o storage!
    } else {
      this.avaliacoes = [];
    }
  }

  get avaliacoesFiltradas() {
    let filtradas = this.avaliacoes;

    // Pesquisa por nome
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      filtradas = filtradas.filter(a =>
        a.nome?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filtro por categoria
    if (this.filter === 'restaurant') {
      filtradas = filtradas.filter(a => a.categoria === 'restaurant');
    } else if (this.filter === 'hotel') {
      filtradas = filtradas.filter(a => a.categoria === 'hotel');
    }

    return filtradas;
  }

  async eliminarAvaliacao(index: number) {
    const confirmMsg = this.translate.instant('AVALIACOES.CONFIRM_DELETE');
    if (confirm(confirmMsg)) {
      this.avaliacoes.splice(index, 1);
      await this._storage?.set('avaliacoes', this.avaliacoes);
    }
  }

async openFilter() {
  await firstValueFrom(this.translate.stream('AVALIACOES.FILTER_HEADER'));

  const translations = await firstValueFrom(
    this.translate.get([
      'AVALIACOES.FILTER_HEADER',
      'AVALIACOES.FILTER_ALL',
      'AVALIACOES.FILTER_RESTAURANT',
      'AVALIACOES.FILTER_HOTEL',
      'AVALIACOES.FILTER_CANCEL'
    ])
  );

  const actionSheet = await this.actionSheetCtrl.create({
    header: translations['AVALIACOES.FILTER_HEADER'],
    buttons: [
      {
        text: translations['AVALIACOES.FILTER_ALL'],
        handler: () => { this.filter = 'all'; }
      },
      {
        text: translations['AVALIACOES.FILTER_RESTAURANT'],
        handler: () => { this.filter = 'restaurant'; }
      },
      {
        text: translations['AVALIACOES.FILTER_HOTEL'],
        handler: () => { this.filter = 'hotel'; }
      },
      {
        text: translations['AVALIACOES.FILTER_CANCEL'],
        role: 'cancel'
      }
    ]
  });

  await actionSheet.present();
}

  async adicionarAvaliacao(avaliacao: Avaliacao) {
    // Corrige categoria antes de guardar
    let categoriaKey = avaliacao.categoria;
    if (categoriaKey?.toLowerCase() === 'restaurante') {
      categoriaKey = 'restaurant';
    } else if (categoriaKey?.toLowerCase() === 'hotel') {
      categoriaKey = 'hotel';
    }
    avaliacao.categoria = categoriaKey;

    this.avaliacoes.push(avaliacao);
    await this._storage?.set('avaliacoes', this.avaliacoes);
  }

  async exportarAvaliacoes() {
    const avaliacoes = await this._storage?.get('avaliacoes') || [];
    const dataStr = JSON.stringify(avaliacoes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'avaliacoes.json';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  async importarAvaliacoes(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e: any) => {
      try {
        let avaliacoesImportadas = JSON.parse(e.target.result);
        if (Array.isArray(avaliacoesImportadas)) {
          // Corrige categorias importadas
          avaliacoesImportadas = avaliacoesImportadas.map(a => {
            if (a.categoria?.toLowerCase() === 'restaurante') {
              a.categoria = 'restaurant';
            } else if (a.categoria?.toLowerCase() === 'hotel') {
              a.categoria = 'hotel';
            }
            return a;
          });
          this.avaliacoes = avaliacoesImportadas;
          await this._storage?.set('avaliacoes', this.avaliacoes);
        } else {
          alert(this.translate.instant('AVALIACOES.INVALID_FILE'));
        }
      } catch {
        alert(this.translate.instant('AVALIACOES.READ_ERROR'));
      }
    };
    reader.readAsText(file);
  }

  async abrirAdicionarAvaliacao() {
    const header = this.translate.instant('AVALIACOES.NEW_REVIEW');
    const inputCategoria = this.translate.instant('AVALIACOES.INPUT_CATEGORY');
    const inputNome = this.translate.instant('AVALIACOES.INPUT_NAME');
    const inputComentario = this.translate.instant('AVALIACOES.INPUT_COMMENT');
    const inputRating = this.translate.instant('AVALIACOES.INPUT_RATING');
    const btnCancel = this.translate.instant('AVALIACOES.CANCEL');
    const btnAdd = this.translate.instant('AVALIACOES.ADD');

    const alert = await this.alertCtrl.create({
      header,
      inputs: [
        { name: 'categoria', type: 'text', placeholder: inputCategoria },
        { name: 'nome', type: 'text', placeholder: inputNome },
        { name: 'comentario', type: 'text', placeholder: inputComentario },
        { name: 'rating', type: 'number', min: 1, max: 5, placeholder: inputRating }
      ],
      buttons: [
        { text: btnCancel, role: 'cancel' },
        {
          text: btnAdd,
          handler: async (data) => {
            // Corrige categoria antes de guardar
            let categoriaKey = data.categoria;
            if (categoriaKey?.toLowerCase() === 'restaurante') {
              categoriaKey = 'restaurant';
            } else if (categoriaKey?.toLowerCase() === 'hotel') {
              categoriaKey = 'hotel';
            }
            const novaAvaliacao = {
              categoria: categoriaKey,
              nome: data.nome,
              comentario: data.comentario,
              rating: Number(data.rating),
              data: new Date().toISOString()
            };
            this.avaliacoes.push(novaAvaliacao);
            await this._storage?.set('avaliacoes', this.avaliacoes);
          }
        }
      ]
    });
    await alert.present();
  }

  getCategoriaTraduzida(categoria: string) {
    if (categoria.toLowerCase() === 'restaurante') {
      return this.translate.instant('AVALIACOES.RESTAURANT');
    } else if (categoria.toLowerCase() === 'hotel') {
      return this.translate.instant('AVALIACOES.HOTEL');
    }
    return categoria;
  }
}