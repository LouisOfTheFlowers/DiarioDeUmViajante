import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

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

  constructor(private actionSheetCtrl: ActionSheetController) {}

  ngOnInit() {
    this.carregarViagens();
  }

  ionViewWillEnter() {
    this.carregarViagens();
  }

  carregarViagens() {
    const viagensGuardadas = localStorage.getItem('viagens');
    if (viagensGuardadas) {
      this.viagens = JSON.parse(viagensGuardadas);
    } else {
      this.viagens = [];
    }
  }

  eliminarViagem(index: number) {
    if (confirm('Tem a certeza que deseja eliminar esta viagem?')) {
      this.viagens.splice(index, 1);
      localStorage.setItem('viagens', JSON.stringify(this.viagens));
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
      filtradas = [...filtradas].reverse(); // Últimas adicionadas primeiro
    } else if (this.precoFiltro === 'maisAntigo') {
      // Mantém a ordem original (primeiras adicionadas primeiro)
      filtradas = [...filtradas];
    }

    return filtradas;
  }
}
