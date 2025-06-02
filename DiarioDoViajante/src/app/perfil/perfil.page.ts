import { Component, OnInit } from '@angular/core';
import { StorageService } from '../Services/storage.service'; // Usa o novo serviço

// Declaração do componente da página de perfil
@Component({
  selector: 'app-perfil', // Seletor do componente
  templateUrl: './perfil.page.html', // Caminho para o template HTML
  styleUrls: ['./perfil.page.scss'], // Caminho para o ficheiro de estilos SCSS
  standalone: false, // Indica se o componente é standalone
})
export class PerfilPage implements OnInit {
  username: string = ''; // Variável para guardar o nome de utilizador

  // Injeta o serviço de storage no construtor
  constructor(private storageService: StorageService) { }

  // Ao iniciar o componente, carrega o nome de utilizador
  async ngOnInit() {
    await this.loadUsername();
  }

  // Sempre que a página é apresentada, atualiza o nome de utilizador
  async ionViewWillEnter() {
    await this.loadUsername();
  }

  // Função privada para ir buscar o nome de utilizador ao storage
  private async loadUsername() {
    const currentUser = await this.storageService.get('currentUser');
    this.username = currentUser?.username || '';
  }
}
