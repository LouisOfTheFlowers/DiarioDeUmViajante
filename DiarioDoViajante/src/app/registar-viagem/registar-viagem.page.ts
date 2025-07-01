import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core'; // Importa o serviço de tradução
import { HttpClient } from '@angular/common/http';
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

// Declaração do componente da página de registo de viagem
@Component({
  selector: 'app-registar-viagem', // Seletor do componente
  templateUrl: './registar-viagem.page.html', // Caminho para o template HTML
  styleUrls: ['./registar-viagem.page.scss'], // Caminho para o ficheiro de estilos SCSS
  standalone: false, // Indica se o componente é standalone
})
export class RegistarViagemPage implements OnInit {

  origem: string = '';
  destino: string = '';
  transporte: string = '';
  outroTransporte: string = '';

  step: number = 1; // 1: info, 2: escolher pontos, 3: resumo

  pontosSelecionados: string[] = [];
  restaurantesSelecionados: string[] = [];
  hoteisSelecionados: string[] = [];

  itinerarios: Itinerario[] = [];

  destinosInfo: Record<string, {pontos: string[]; restaurantes: string[]; hoteis: string[]}> = {};

  opcoes = {pontos: [] as string[], restaurantes: [] as string[], hoteis: [] as string[]};


  // Injeta os serviços necessários no construtor
  constructor(
    private storageService: StorageService, // Usa o novo serviço
    private location: Location,
    private alertCtrl: AlertController,
    private translate: TranslateService, // Serviço de tradução
    private http: HttpClient
  ) {}

  private carregarDestinos() {
    if (Object.keys(this.destinosInfo).length) {
      return;
    }
    this.http
      .get<Record<string, {pontos: string[]; restaurantes: string[]; hoteis: string[]}>>('assets/destinos.json')
      .subscribe(data => {
        this.destinosInfo = data;
      });
  }

  // Inicializa e carrega os itinerários guardados ao iniciar o componente
  async ngOnInit() {
    const its = await this.storageService.get('itinerarios');
    if (its) {
      this.itinerarios = its;
    }

    this.carregarDestinos();
  }

  // Sempre que a página é apresentada, limpa os campos do formulário
  ionViewWillEnter() {
    this.origem = '';
    this.destino = '';
    this.transporte = '';
    this.outroTransporte = '';
    this.pontosSelecionados = [];
    this.restaurantesSelecionados = [];
    this.hoteisSelecionados = [];
    this.step = 1;
  }

  atualizarOpcoes() {
    const chave = Object.keys(this.destinosInfo).find(
      d => d.toLowerCase() === this.destino.trim().toLowerCase()
    );
    if (chave) {
      this.opcoes = JSON.parse(JSON.stringify(this.destinosInfo[chave]));
    } else {
      this.opcoes = { pontos: [], restaurantes: [], hoteis: [] };
    }
    this.pontosSelecionados = [];
    this.restaurantesSelecionados = [];
    this.hoteisSelecionados = [];
  }

  nextFromInfo() {
    if (!this.origem || !this.destino || !this.transporte) {
      this.apresentarAlerta(
        this.translate.instant('REGISTAR_AVALIACAO.PREENCHA_TODOS_OS_CAMPOS')
      );
      return;
    }

    this.carregarDestinos();
    this.atualizarOpcoes();
    this.step = 2;
  }

  nextFromPontos() {
    this.step = 3;
  }

  async confirmarViagem() {

    const transporteFinal = this.transporte === 'outro' ? this.outroTransporte : this.transporte;

    const novoItinerario: Itinerario = {
      origem: this.origem,
      destino: this.destino,
      transporte: transporteFinal,
      pontos: this.pontosSelecionados,
      restaurantes: this.restaurantesSelecionados,
      hoteis: this.hoteisSelecionados,
      preco: null
    };
    
  const alert = await this.alertCtrl.create({
      header: this.translate.instant('REGISTAR_VIAGEM.TITLE'),
      message: this.translate.instant('REGISTAR_VIAGEM.CONFIRMAR_GUARDAR'),
      buttons: [
        {
          text: this.translate.instant('HISTORICO_VIAGENS.FILTER_CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('REGISTAR_AVALIACAO.OK'),
          handler: async () => {
            this.itinerarios.push(novoItinerario);
            await this.storageService.set('itinerarios', this.itinerarios);
            this.ionViewWillEnter();
          }
        }
      ]
    });

    await alert.present();
  }

  togglePonto(p: string) {
    const idx = this.pontosSelecionados.indexOf(p);
    if (idx > -1) {
      this.pontosSelecionados.splice(idx, 1);
    } else {
      this.pontosSelecionados.push(p);
    }
  }

  toggleRestaurante(r: string) {
    const idx = this.restaurantesSelecionados.indexOf(r);
    if (idx > -1) {
      this.restaurantesSelecionados.splice(idx, 1);
    } else {
      this.restaurantesSelecionados.push(r);
    }
  }

  toggleHotel(h: string) {
    const idx = this.hoteisSelecionados.indexOf(h);
    if (idx > -1) {
      this.hoteisSelecionados.splice(idx, 1);
    } else {
      this.hoteisSelecionados.push(h);
    }
  }

  // Volta para a página anterior
  voltarAtras() {
    if (this.step > 1) {
      this.step--;
    } else {
      this.location.back();
    }
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
          await this.apresentarAlerta(
            this.translate.instant('HISTORICO_VIAGENS.INVALID_FILE')
          );
        }
      } catch {
        await this.apresentarAlerta(
          this.translate.instant('HISTORICO_VIAGENS.READ_ERROR')
        );
      }
    };
    reader.readAsText(file);
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

  // Mostra um alerta com a mensagem recebida
  private async apresentarAlerta(mensagem: string) {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('REGISTAR_AVALIACAO.ATENCAO'),
      message: mensagem,
      buttons: [this.translate.instant('REGISTAR_AVALIACAO.OK')]
    });

    await alert.present();
  }
}