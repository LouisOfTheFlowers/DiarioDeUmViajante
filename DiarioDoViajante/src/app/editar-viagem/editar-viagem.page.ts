import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from '../Services/storage.service';

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
  selector: 'app-editar-viagem',
  templateUrl: './editar-viagem.page.html',
  styleUrls: ['./editar-viagem.page.scss'],
  standalone: false,
})
export class EditarViagemPage implements OnInit {
  index: number = 0;

  origem: string = '';
  destino: string = '';
  transporte: string = '';
  outroTransporte: string = '';

  destinoAnterior: string = '';

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
    private translate: TranslateService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
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
    this.index = Number(this.route.snapshot.paramMap.get('index'));
    const its: Itinerario[] = (await this.storageService.get('itinerarios')) || [];
    this.itinerarios = its;
    const itin = its[this.index];
    if (itin) {
      this.origem = itin.origem;
      this.destino = itin.destino;
      this.destinoAnterior = itin.destino;
      this.transporte = itin.transporte;
      this.pontosSelecionados = [...itin.pontos];
      this.restaurantesSelecionados = [...itin.restaurantes];
      this.hoteisSelecionados = [...itin.hoteis];
      if (!['carro','comboio','autocarro','aviao'].includes(itin.transporte)) {
        this.outroTransporte = itin.transporte;
        this.transporte = 'outro';
      }
    }

    this.carregarDestinos();
    this.atualizarOpcoes();
  }

  // Sempre que a página é apresentada, limpa os campos do formulário
  ionViewWillEnter() {
    this.step = 1;
  }

  atualizarOpcoes(resetSelecionados = false) {
    const chave = Object.keys(this.destinosInfo).find(
      d => d.toLowerCase() === this.destino.trim().toLowerCase()
    );
    if (chave) {
      this.opcoes = JSON.parse(JSON.stringify(this.destinosInfo[chave]));
    } else {
      this.opcoes = { pontos: [], restaurantes: [], hoteis: [] };
    }
    if (resetSelecionados) {
      this.pontosSelecionados = [];
      this.restaurantesSelecionados = [];
      this.hoteisSelecionados = [];
    }
  }

  nextFromInfo() {
    if (!this.origem || !this.destino || !this.transporte) {
      this.apresentarAlerta(
        this.translate.instant('REGISTAR_AVALIACAO.PREENCHA_TODOS_OS_CAMPOS')
      );
      return;
    }

    this.carregarDestinos();
    const mudou =
      this.destino.trim().toLowerCase() !==
      this.destinoAnterior.trim().toLowerCase();
    this.atualizarOpcoes(mudou);
    this.destinoAnterior = this.destino;
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
      header: this.translate.instant('EDITAR_VIAGEM.TITLE'),
      message: this.translate.instant('EDITAR_VIAGEM.CONFIRMAR_GUARDAR'),
      buttons: [
        {
          text: this.translate.instant('HISTORICO_VIAGENS.FILTER_CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('REGISTAR_AVALIACAO.OK'),
          handler: async () => {
            this.itinerarios[this.index] = novoItinerario;
            await this.storageService.set('itinerarios', this.itinerarios);
            this.router.navigate(['/historico-viagem']);
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
  voltarAtras(event?: Event) {
    if (this.step > 1) {
      event?.preventDefault();
      this.step--;
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