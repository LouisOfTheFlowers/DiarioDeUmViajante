import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage {
  searchTerm = '';
  destinos = [
    {
      titulo: 'ROMA',
      imagem: 'assets/images/roma.jpg',
      descricao: 'ROMA_DESC',
      wikipedia: 'https://pt.wikipedia.org/wiki/Roma'
    },
    {
      titulo: 'PARIS',
      imagem: 'assets/images/paris.jpg',
      descricao: 'PARIS_DESC',
      wikipedia: 'https://pt.wikipedia.org/wiki/Paris'
    }
  ];

  abrirWikipedia(url: string) {
    window.open(url, '_blank');
  }
}
