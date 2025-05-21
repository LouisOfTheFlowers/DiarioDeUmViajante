import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registar-viagem',
  templateUrl: './registar-viagem.page.html',
  styleUrls: ['./registar-viagem.page.scss'],
  standalone: false,
})
export class RegistarViagemPage implements OnInit {

  destino: string = '';
  percurso: string = '';
  preco: number | null = null;
  transporte: string = '';

  constructor() {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.destino = '';
    this.percurso = '';
    this.preco = null;
    this.transporte = '';
  }
}

