import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../Services/storage.service'; // Usa o novo serviço

// Define a interface para uma viagem
interface Viagem {
  destino: string;
  percurso: string;
  preco: number | null;
  transportes: string[];
}

// Declaração do componente da página de histórico de viagens
@Component({
  selector: 'app-historico-viagem', // Seletor do componente
  templateUrl: './historico-viagem.page.html', // Caminho para o ficheiro HTML do template
  styleUrls: ['./historico-viagem.page.scss'], // Caminho para o ficheiro de estilos SCSS
  standalone: false, // Indica se o componente é standalone
})
export class HistoricoViagemPage implements OnInit {
  // Lista de viagens
  viagens: Viagem[] = [];
  // Termo de pesquisa para filtrar viagens
  searchTerm: string = '';
  // Filtro de preço ou ordem
  precoFiltro: 'nenhum' | 'asc' | 'desc' | 'maisRecente' | 'maisAntigo' = 'nenhum';

  // Injeta os serviços necessários no construtor
  constructor(
    private actionSheetCtrl: ActionSheetController,
    private storageService: StorageService, // Usa o novo serviço
    private translate: TranslateService
  ) {}

  // Inicializa e carrega as viagens ao iniciar o componente
  async ngOnInit() {
    await this.carregarViagens();
  }

  // Sempre que a página é apresentada, recarrega as viagens
  async ionViewWillEnter() {
    await this.carregarViagens();
  }

  // Carrega as viagens do storage
  async carregarViagens() {
    const viagensGuardadas = await this.storageService.get('viagens');
    if (viagensGuardadas) {
      this.viagens = viagensGuardadas;
    } else {
      this.viagens = [];
    }
  }

  // Elimina uma viagem pelo índice
  async eliminarViagem(index: number) {
    const confirmMsg = this.translate.instant('HISTORICO_VIAGENS.CONFIRM_DELETE');
    if (confirm(confirmMsg)) {
      this.viagens.splice(index, 1);
      await this.storageService.set('viagens', this.viagens);
    }
  }

  // Abre o menu de filtro de preço/ordem
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

  // Devolve as viagens filtradas pelo termo de pesquisa e filtro selecionado
  get viagensFiltradas() {
    let filtradas = this.viagens;

    // Pesquisa por destino
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      filtradas = filtradas.filter(v =>
        v.destino.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Aplica o filtro de preço/ordem
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

  // Exporta as viagens para um ficheiro JSON (download)
  async exportarViagens() {
    const viagens = await this.storageService.get('viagens') || [];
    const dataStr = JSON.stringify(viagens, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'viagens.json';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  // Importa viagens a partir de um ficheiro JSON selecionado pelo utilizador
  async importarViagens(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e: any) => {
      try {
        const viagensImportadas = JSON.parse(e.target.result);
        if (Array.isArray(viagensImportadas)) {
          this.viagens = viagensImportadas;
          await this.storageService.set('viagens', this.viagens);
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
