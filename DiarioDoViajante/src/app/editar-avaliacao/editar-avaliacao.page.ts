import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from '../Services/storage.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface Avaliacao {
  categoria: string;
  nome: string;
  comentario: string;
  rating: number;
  foto?: string | null;
  data: string;
}

@Component({
  selector: 'app-editar-avaliacao',
  templateUrl: './editar-avaliacao.page.html',
  styleUrls: ['./editar-avaliacao.page.scss'],
  standalone: false,
})
export class EditarAvaliacaoPage implements OnInit {
  index: number = 0;
  categoria: string = '';
  nome: string = '';
  comentario: string = '';
  rating: number = 0;
  foto: string | null = null;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private translate: TranslateService
  ) {}

  async ngOnInit() {
    this.index = Number(this.route.snapshot.paramMap.get('index'));
    const avaliacoes: Avaliacao[] = (await this.storageService.get('avaliacoes')) || [];
    const avaliacao = avaliacoes[this.index];
    if (avaliacao) {
      this.categoria = avaliacao.categoria;
      this.nome = avaliacao.nome;
      this.comentario = avaliacao.comentario;
      this.rating = avaliacao.rating;
      this.foto = avaliacao.foto ?? null;
    }
  }

  setRating(star: number) {
    this.rating = star;
  }

  async escolherFoto() {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });
    this.foto = image.dataUrl ?? null;
  }

  async guardarAlteracoes() {
    if (!this.categoria || !this.nome || !this.comentario || !this.rating) {
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('REGISTAR_AVALIACAO.ATENCAO'),
        message: this.translate.instant('REGISTAR_AVALIACAO.PREENCHA_TODOS_OS_CAMPOS'),
        buttons: [this.translate.instant('REGISTAR_AVALIACAO.OK')],
      });
      await alert.present();
      return;
    }

    let categoriaKey = this.categoria;
    if (categoriaKey.toLowerCase() === 'restaurante') {
      categoriaKey = 'restaurant';
    } else if (categoriaKey.toLowerCase() === 'hotel') {
      categoriaKey = 'hotel';
    }

    const avaliacoes: Avaliacao[] = (await this.storageService.get('avaliacoes')) || [];
    if (avaliacoes[this.index]) {
      avaliacoes[this.index] = {
        ...avaliacoes[this.index],
        categoria: categoriaKey,
        nome: this.nome,
        comentario: this.comentario,
        rating: this.rating,
        foto: this.foto,
      };
      await this.storageService.set('avaliacoes', avaliacoes);
    }

    this.router.navigate(['/avaliacoes']);
  }
}