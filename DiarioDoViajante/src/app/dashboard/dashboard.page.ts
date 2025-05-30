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
      titulo: 'Roma',
      imagem: 'assets/images/roma.jpg',
      descricao: 'Roma, uma cidade eterna, encanta os turistas com sua história, monumentos grandiosos, gastronomia irresistível e charme incomparável. O Coliseu, o Vaticano e a Fontana di Trevi são inesquecíveis!',
      wikipedia: 'https://pt.wikipedia.org/wiki/Roma'
    },
    {
      titulo: 'Paris',
      imagem: 'assets/images/paris.jpg',
      descricao: 'Paris, a Cidade Luz, cativa os turistas com sua história, monumentos icônicos, culinária requintada e charme romântico. Torre Eiffel, Louvre, inesquecível!',
      wikipedia: 'https://pt.wikipedia.org/wiki/Paris'
    }
  ];

  abrirWikipedia(url: string) {
    window.open(url, '_blank');
  }
}
