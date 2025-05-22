import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

interface Viagem {
  destino: string;
  percurso: string;
  preco: number | null;
  transportes: string[]; // array!
}

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
  transportes: string[] = []; // array para vários transportes

  viagens: Viagem[] = []; // Array para guardar as viagens

  constructor(private location: Location) {}

  ngOnInit() {
    const viagensGuardadas = localStorage.getItem('viagens');
    if (viagensGuardadas) {
      this.viagens = JSON.parse(viagensGuardadas);
    }
  }

  ionViewWillEnter() {
    this.destino = '';
    this.percurso = '';
    this.preco = null;
    this.transportes = [];
  }

  confirmarViagem() {
    const novaViagem: Viagem = {
      destino: this.destino,
      percurso: this.percurso,
      preco: this.preco,
      transportes: this.transportes
    };
    this.viagens.push(novaViagem);
    localStorage.setItem('viagens', JSON.stringify(this.viagens));
    this.destino = '';
    this.percurso = '';
    this.preco = null;
    this.transportes = [];
  }

  voltarAtras() {
    this.location.back();
  }
}

