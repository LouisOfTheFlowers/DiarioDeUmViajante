import { Component } from '@angular/core';

// Declaração do componente Dashboard
@Component({
  selector: 'app-dashboard', // Seletor do componente
  templateUrl: './dashboard.page.html', // Caminho para o ficheiro HTML do template
  styleUrls: ['./dashboard.page.scss'], // Caminho para o ficheiro de estilos SCSS
  standalone: false, // Indica se o componente é standalone
})
export class DashboardPage {
  // Variável para guardar o termo de pesquisa introduzido pelo utilizador
  searchTerm = '';

  // Lista de destinos disponíveis no dashboard
  destinos = [
    {
      titulo: 'ROMA', // Nome do destino
      imagem: 'assets/images/roma.jpg', // Caminho para a imagem do destino
      descricao: 'ROMA_DESC', // Chave para a descrição traduzida
      wikipedia: 'https://pt.wikipedia.org/wiki/Roma' // Link para a Wikipédia
    },
    {
      titulo: 'PARIS',
      imagem: 'assets/images/paris.jpg',
      descricao: 'PARIS_DESC',
      wikipedia: 'https://pt.wikipedia.org/wiki/Paris'
    }
  ];

  // Função que abre o link da Wikipédia do destino numa nova aba
  abrirWikipedia(url: string) {
    window.open(url, '_blank');
  }
}
