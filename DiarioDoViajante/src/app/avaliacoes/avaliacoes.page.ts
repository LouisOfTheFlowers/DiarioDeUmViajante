import { Component } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

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
  filter: 'all' | 'restaurante' | 'hotel' = 'all';

  private _storage: Storage | null = null;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private storage: Storage,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    this._storage = await this.storage.create();
    const avaliacoesGuardadas = await this._storage.get('avaliacoes');
    if (avaliacoesGuardadas) {
      this.avaliacoes = avaliacoesGuardadas;
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
    if (this.filter === 'restaurante') {
      filtradas = filtradas.filter(a => a.categoria?.toLowerCase() === 'restaurante');
    } else if (this.filter === 'hotel') {
      filtradas = filtradas.filter(a => a.categoria?.toLowerCase() === 'hotel');
    }

    return filtradas;
  }

  async eliminarAvaliacao(index: number) {
    if (confirm('Tem a certeza que deseja eliminar esta avaliação?')) {
      this.avaliacoes.splice(index, 1);
      await this._storage?.set('avaliacoes', this.avaliacoes);
    }
  }

  async openFilter() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Filtrar por',
      buttons: [
        {
          text: 'Todos',
          handler: () => { this.filter = 'all'; }
        },
        {
          text: 'Restaurante',
          handler: () => { this.filter = 'restaurante'; }
        },
        {
          text: 'Hotel',
          handler: () => { this.filter = 'hotel'; }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async adicionarAvaliacao(avaliacao: Avaliacao) {
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
        const avaliacoesImportadas = JSON.parse(e.target.result);
        if (Array.isArray(avaliacoesImportadas)) {
          this.avaliacoes = avaliacoesImportadas;
          await this._storage?.set('avaliacoes', this.avaliacoes);
        } else {
          alert('Ficheiro inválido!');
        }
      } catch {
        alert('Erro ao ler ficheiro!');
      }
    };
    reader.readAsText(file);
  }

  async abrirAdicionarAvaliacao() {
    const alert = await this.alertCtrl.create({
      header: 'Nova Avaliação',
      inputs: [
        { name: 'categoria', type: 'text', placeholder: 'Categoria (ex: Restaurante)' },
        { name: 'nome', type: 'text', placeholder: 'Seu Nome' },
        { name: 'comentario', type: 'text', placeholder: 'Comentário' },
        { name: 'rating', type: 'number', min: 1, max: 5, placeholder: 'Rating (1-5)' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Adicionar',
          handler: async (data) => {
            const novaAvaliacao = {
              categoria: data.categoria,
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
}