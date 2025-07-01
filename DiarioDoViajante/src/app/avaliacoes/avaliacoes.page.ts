// Importa os módulos e serviços necessários do Angular, Ionic e ngx-translate
import { Component } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { StorageService } from '../Services/storage.service'; // Importa o novo serviço de storage

// Define a interface para uma avaliação
interface Avaliacao {
  categoria: string;
  nome: string;
  comentario: string;
  rating: number;
  foto?: string | null;
  data: string;
}

// Declaração do componente da página de avaliações
@Component({
  selector: 'app-avaliacoes',
  templateUrl: './avaliacoes.page.html',
  styleUrls: ['./avaliacoes.page.scss'],
  standalone: false
})
export class AvaliacoesPage {
  // Lista de avaliações
  avaliacoes: Avaliacao[] = [];
  // Termo de pesquisa para filtrar avaliações
  searchTerm: string = '';
  // Filtro de categoria (todas, restaurante ou hotel)
  filter: 'all' | 'restaurant' | 'hotel' = 'all';

  // Injeta os serviços necessários no construtor
  constructor(
    private actionSheetCtrl: ActionSheetController,
    private storageService: StorageService, // Usa o novo serviço
    private alertCtrl: AlertController,
    private translate: TranslateService
  ) {
    // Subscreve à mudança de idioma
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      console.log('Idioma mudado para:', event.lang);
    });
  }

  // Inicializa e carrega as avaliações ao iniciar o componente
  async ngOnInit() {
    await this.carregarAvaliacoes();
  }

  // Sempre que a página é apresentada, recarrega as avaliações
  async ionViewWillEnter() {
    await this.carregarAvaliacoes();
  }

  // Carrega as avaliações do storage e faz correção de categorias antigas
  private async carregarAvaliacoes() {
    let avaliacoesGuardadas = await this.storageService.get('avaliacoes');
    if (avaliacoesGuardadas) {
      // Corrige categorias antigas para os valores atuais
      avaliacoesGuardadas = avaliacoesGuardadas.map((a: Avaliacao) => {
        if (a.categoria?.toLowerCase() === 'restaurante') {
          a.categoria = 'restaurant';
        } else if (a.categoria?.toLowerCase() === 'hotel') {
          a.categoria = 'hotel';
        }
        return a;
      });
      this.avaliacoes = avaliacoesGuardadas;
      await this.storageService.set('avaliacoes', avaliacoesGuardadas); // Atualiza o storage!
    } else {
      this.avaliacoes = [];
    }
  }

  // Devolve as avaliações filtradas pelo termo de pesquisa e categoria
  get avaliacoesFiltradas() {
    let filtradas = this.avaliacoes;

    // Filtra pelo nome se houver termo de pesquisa
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      filtradas = filtradas.filter(a =>
        a.nome?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filtra pela categoria selecionada
    if (this.filter === 'restaurant') {
      filtradas = filtradas.filter(a => a.categoria === 'restaurant');
    } else if (this.filter === 'hotel') {
      filtradas = filtradas.filter(a => a.categoria === 'hotel');
    }

    return filtradas;
  }

  // Elimina uma avaliação pelo índice
  async eliminarAvaliacao(index: number) {
    const translations = await firstValueFrom(
      this.translate.get([
        'AVALIACOES.CONFIRM_DELETE',
        'AVALIACOES.CANCEL',
        'AVALIACOES.DELETE',
        'REGISTAR_AVALIACAO.ATENCAO'
      ])
    );

    const alert = await this.alertCtrl.create({
      header: translations['REGISTAR_AVALIACAO.ATENCAO'],
      message: translations['AVALIACOES.CONFIRM_DELETE'],
      buttons: [
        {
          text: translations['AVALIACOES.CANCEL'],
          role: 'cancel'
        },
        {
          text: translations['AVALIACOES.DELETE'],
          handler: async () => {
            this.avaliacoes.splice(index, 1);
            await this.storageService.set('avaliacoes', this.avaliacoes);
          }
        }
      ]
    });

    await alert.present();
  }

  // Abre o menu de filtro de categoria
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

  // Adiciona uma nova avaliação à lista e ao storage
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
    await this.storageService.set('avaliacoes', this.avaliacoes);
  }

  // Exporta as avaliações para um ficheiro JSON (download)
  async exportarAvaliacoes() {
    const avaliacoes = await this.storageService.get('avaliacoes') || [];
    const dataStr = JSON.stringify(avaliacoes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'avaliacoes.json';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  // Importa avaliações a partir de um ficheiro JSON selecionado pelo utilizador
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
          await this.storageService.set('avaliacoes', this.avaliacoes);
        } else {
          alert(this.translate.instant('AVALIACOES.INVALID_FILE'));
        }
      } catch {
        alert(this.translate.instant('AVALIACOES.READ_ERROR'));
      }
    };
    reader.readAsText(file);
  }

  // Abre um alerta para adicionar uma nova avaliação manualmente
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
            await this.storageService.set('avaliacoes', this.avaliacoes);
          }
        }
      ]
    });
    await alert.present();
  }

  // Traduz a categoria para o idioma atual
  getCategoriaTraduzida(categoria: string) {
    if (categoria.toLowerCase() === 'restaurante') {
      return this.translate.instant('AVALIACOES.RESTAURANT');
    } else if (categoria.toLowerCase() === 'hotel') {
      return this.translate.instant('AVALIACOES.HOTEL');
    }
    return categoria;
  }
}