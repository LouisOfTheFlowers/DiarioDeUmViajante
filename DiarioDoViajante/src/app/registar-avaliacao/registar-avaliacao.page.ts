import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importa o router para navegação
import { StorageService } from '../Services/storage.service'; // Usa o novo serviço
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; // Importa funcionalidades da câmara
import { AlertController } from '@ionic/angular'; // Importa o controlador de alertas do Ionic
import { TranslateService } from '@ngx-translate/core'; // Importa o serviço de tradução

@Component({
  selector: 'app-registar-avaliacao', // Seletor do componente
  templateUrl: './registar-avaliacao.page.html', // Caminho para o template HTML
  styleUrls: ['./registar-avaliacao.page.scss'], // Caminho para o ficheiro de estilos SCSS
  standalone: false, // Indica se o componente é standalone
})
export class RegistarAvaliacaoPage {
  categoria: string = ''; // Categoria da avaliação (restaurante/hotel)
  nome: string = ''; // Nome do local avaliado
  comentario: string = ''; // Comentário do utilizador
  rating: number = 0; // Avaliação em estrelas
  foto: string | null = null; // Fotografia associada à avaliação

  // Injeta os serviços necessários no construtor
  constructor(
    private storageService: StorageService, // Usa o novo serviço
    private router: Router,
    private alertCtrl: AlertController,
    private translate: TranslateService // Serviço de tradução
  ) {}

  // Define o número de estrelas selecionado
  setRating(star: number) {
    this.rating = star;
  }

  // Permite ao utilizador escolher ou tirar uma fotografia
  async escolherFoto() {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });
    this.foto = image.dataUrl ?? null;
  }

  // Confirma e guarda a avaliação no storage
  async confirmarAvaliacao() {
    // Valida se todos os campos obrigatórios estão preenchidos
    if (!this.categoria || !this.nome || !this.comentario || !this.rating) {
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('REGISTAR_AVALIACAO.ATENCAO'),
        message: this.translate.instant('REGISTAR_AVALIACAO.PREENCHA_TODOS_OS_CAMPOS'),
        buttons: [this.translate.instant('REGISTAR_AVALIACAO.OK')],
      });
      await alert.present();
      return;
    }

    // Guarda a categoria como "restaurant" ou "hotel"
    let categoriaKey = this.categoria;
    if (categoriaKey.toLowerCase() === 'restaurante') {
      categoriaKey = 'restaurant';
    } else if (categoriaKey.toLowerCase() === 'hotel') {
      categoriaKey = 'hotel';
    }

    // Cria o objeto da nova avaliação
    const novaAvaliacao = {
      categoria: categoriaKey,
      nome: this.nome,
      comentario: this.comentario,
      rating: this.rating,
      foto: this.foto,
      data: new Date().toISOString(),
    };

    // Vai buscar as avaliações já guardadas e adiciona a nova
    const avaliacoes = (await this.storageService.get('avaliacoes')) || [];
    avaliacoes.push(novaAvaliacao);
    await this.storageService.set('avaliacoes', avaliacoes);

    // Navega para a página de avaliações após guardar
    this.router.navigate(['/avaliacoes']);
  }
}