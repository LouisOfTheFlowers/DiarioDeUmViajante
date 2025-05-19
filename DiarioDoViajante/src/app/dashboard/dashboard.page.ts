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
      descricao: 'Roma, an eternal city, enchants tourists with its history, grandiose monuments, irresistible cuisine and unparalleled charm. The Colosseum, the Vatican and the Trevi Fountain are unforgettable!'
    },
    {
      titulo: 'Paris',
      imagem: 'assets/images/paris.jpg',
      descricao: 'Paris, the City of Light, captivates tourists with its history, iconic landmarks, exquisite cuisine, and romantic charm. Eiffel Tower, Louvre, unforgettable!'
    }
  ];
}
