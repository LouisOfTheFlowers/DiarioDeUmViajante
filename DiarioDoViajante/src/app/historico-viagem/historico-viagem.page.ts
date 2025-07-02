import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../Services/storage.service'; // Usa o novo serviço

// Define a interface para uma viagem
interface Itinerario {
  origem: string;
  destino: string;
  transporte: string;
  pontos: string[];
  restaurantes: string[];
  hoteis: string[];
  preco?: number | null;
}

// Declaração do componente da página de histórico de viagens
@Component({
  selector: 'app-historico-viagem', // Seletor do componente
  templateUrl: './historico-viagem.page.html', // Caminho para o ficheiro HTML do template
  styleUrls: ['./historico-viagem.page.scss'], // Caminho para o ficheiro de estilos SCSS
  standalone: false, // Indica se o componente é standalone
})
export class HistoricoViagemPage implements OnInit {
  itinerarios: Itinerario[] = [];
  // Termo de pesquisa para filtrar itinerários
  searchTerm: string = '';
  // Filtro por meio de transporte
  transporteFiltro: 'todos' | 'carro' | 'comboio' | 'autocarro' | 'aviao' = 'todos';

  // Injeta os serviços necessários no construtor
  constructor(
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
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

  // Carrega os itinerários do storage
  async carregarViagens() {
    const guardados = await this.storageService.get('itinerarios');
    if (guardados) {
      this.itinerarios = guardados;
    } else {
      this.itinerarios = [];
    }
  }

  // Elimina uma viagem pelo índice com confirmação
  async eliminarViagem(index: number) {
    const translations = await firstValueFrom(
      this.translate.get([
        'HISTORICO_VIAGENS.CONFIRM_DELETE',
        'AVALIACOES.CANCEL',
        'AVALIACOES.DELETE',
        'REGISTAR_AVALIACAO.ATENCAO'
      ])
    );

    const alert = await this.alertCtrl.create({
      header: translations['REGISTAR_AVALIACAO.ATENCAO'],
      message: translations['HISTORICO_VIAGENS.CONFIRM_DELETE'],
      buttons: [
        {
          text: translations['AVALIACOES.CANCEL'],
          role: 'cancel'
        },
        {
          text: translations['AVALIACOES.DELETE'],
          handler: async () => {
            this.itinerarios.splice(index, 1);
            await this.storageService.set('itinerarios', this.itinerarios);
          }
        }
      ]
    });

    await alert.present();
  }

  // Abre o menu de filtro por transporte
  async abrirFiltro() {
    const header = this.translate.instant('HISTORICO_VIAGENS.FILTER_HEADER');
    const btnAll = this.translate.instant('HISTORICO_VIAGENS.FILTER_ALL');
    const btnCar = this.translate.instant('HISTORICO_VIAGENS.FILTER_CARRO');
    const btnTrain = this.translate.instant('HISTORICO_VIAGENS.FILTER_COMBOIO');
    const btnBus = this.translate.instant('HISTORICO_VIAGENS.FILTER_AUTOCARRO');
    const btnPlane = this.translate.instant('HISTORICO_VIAGENS.FILTER_AVIAO');
    const btnCancel = this.translate.instant('HISTORICO_VIAGENS.FILTER_CANCEL');

    const actionSheet = await this.actionSheetCtrl.create({
      header,
      buttons: [
        {
          text: btnAll,
          handler: () => { this.transporteFiltro = 'todos'; }
        },
        {
          text: btnCar,
          handler: () => { this.transporteFiltro = 'carro'; }
        },
        {
          text: btnTrain,
          handler: () => { this.transporteFiltro = 'comboio'; }
        },
        {
          text: btnPlane,
          handler: () => { this.transporteFiltro = 'aviao'; }
        },
        {
          text: btnBus,
          handler: () => { this.transporteFiltro = 'autocarro'; }
        },
        {
          text: btnCancel,
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  // Devolve os itinerários filtrados pelo termo de pesquisa e meio de transporte
  get viagensFiltradas() {
    let filtradas = this.itinerarios;

    // Pesquisa por destino
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      filtradas = filtradas.filter(v =>
        v.destino.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Aplica o filtro de transporte
    if (this.transporteFiltro !== 'todos') {
      filtradas = filtradas.filter(v => v.transporte.toLowerCase() === this.transporteFiltro);
    }

    return filtradas;
  }

  // Exporta as viagens para um ficheiro JSON (download)
  async exportarViagens() {
    const viagens = await this.storageService.get('itinerarios') || [];
    const dataStr = JSON.stringify(viagens, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'itinerarios.json';
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
        const itinerariosImportados = JSON.parse(e.target.result);
        if (Array.isArray(itinerariosImportados)) {
          this.itinerarios = itinerariosImportados;
          await this.storageService.set('itinerarios', this.itinerarios);
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
