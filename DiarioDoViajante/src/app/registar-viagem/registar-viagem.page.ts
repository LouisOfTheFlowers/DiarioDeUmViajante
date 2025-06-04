import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'; // Importa para navegação para trás
import { AlertController } from '@ionic/angular'; // Importa o controlador de alertas do Ionic
import { TranslateService } from '@ngx-translate/core'; // Importa o serviço de tradução
import { StorageService } from '../Services/storage.service'; // Usa o novo serviço

// Define a interface para uma viagem
interface Viagem {
  destino: string;
  percurso: string;
  preco: number | null;
  transportes: string[];
}

// Declaração do componente da página de registo de viagem
@Component({
  selector: 'app-registar-viagem', // Seletor do componente
  templateUrl: './registar-viagem.page.html', // Caminho para o template HTML
  styleUrls: ['./registar-viagem.page.scss'], // Caminho para o ficheiro de estilos SCSS
  standalone: false, // Indica se o componente é standalone
})
export class RegistarViagemPage implements OnInit {

  destino: string = ''; // Destino da viagem
  percurso: string = ''; // Percurso da viagem
  preco: number | null = null; // Preço da viagem
  transportes: string[] = []; // Lista de transportes selecionados

  viagens: Viagem[] = []; // Lista de viagens guardadas

  // Injeta os serviços necessários no construtor
  constructor(
    private storageService: StorageService, // Usa o novo serviço
    private location: Location,
    private alertCtrl: AlertController,
    private translate: TranslateService // Serviço de tradução
  ) {}

  // Inicializa e carrega as viagens guardadas ao iniciar o componente
  async ngOnInit() {
    const viagensGuardadas = await this.storageService.get('viagens');
    if (viagensGuardadas) {
      this.viagens = viagensGuardadas;
    }
  }

  // Sempre que a página é apresentada, limpa os campos do formulário
  ionViewWillEnter() {
    this.destino = '';
    this.percurso = '';
    this.preco = null;
    this.transportes = [];
  }

  // Confirma e guarda uma nova viagem no storage e faz download do ficheiro JSON
  async confirmarViagem() {
    // Valida se todos os campos obrigatórios estão preenchidos
    if (
      !this.destino ||
      !this.percurso ||
      this.preco === null ||
      this.preco === undefined ||
      this.transportes.length === 0
    ) {
      await this.apresentarAlerta(
        this.translate.instant('REGISTAR_AVALIACAO.PREENCHA_TODOS_OS_CAMPOS')
      );
      return;
    }

    // Cria o objeto da nova viagem
    const novaViagem: Viagem = {
      destino: this.destino,
      percurso: this.percurso,
      preco: this.preco,
      transportes: this.transportes
    };
    // Adiciona a nova viagem à lista
    this.viagens.push(novaViagem);
    // Guarda a lista atualizada no storage
    await this.storageService.set('viagens', this.viagens);
    // Exporta as viagens para ficheiro JSON (download automático)
    await this.exportarViagens();

    // Limpa os campos do formulário
    this.destino = '';
    this.percurso = '';
    this.preco = null;
    this.transportes = [];
  }

  // Volta para a página anterior
  voltarAtras() {
    this.location.back();
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