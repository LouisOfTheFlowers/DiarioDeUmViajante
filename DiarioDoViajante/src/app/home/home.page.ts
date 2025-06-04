import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa módulos para formulários reativos
import { Router } from '@angular/router'; // Importa o router para navegação
import { ToastController } from '@ionic/angular'; // Importa o controlador de toasts do Ionic
import { TranslateService } from '@ngx-translate/core'; // Importa o serviço de tradução
import { StorageService } from '../Services/storage.service'; // Usa o novo serviço

@Component({
  selector: 'app-home', // Seletor do componente
  templateUrl: './home.page.html', // Caminho para o template HTML
  styleUrls: ['./home.page.scss'], // Caminho para o ficheiro de estilos SCSS
  standalone: false, // Indica se o componente é standalone
})
export class HomePage implements OnInit {
  loginForm!: FormGroup; // Formulário reativo para login

  // Injeta os serviços necessários no construtor
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private storageService: StorageService, // Usa o novo serviço
    private toastCtrl: ToastController,
    private translate: TranslateService
  ) {}

  // Inicializa e cria o formulário ao iniciar o componente
  async ngOnInit() {
    this.createForm();
  }

  // Cria o formulário de login com validação obrigatória para username e password
  createForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Função chamada ao submeter o formulário de login
  async login() {
    // Se o formulário for inválido, mostra um toast de erro
    if (this.loginForm.invalid) {
      const toast = await this.toastCtrl.create({
        message: this.translate.instant('LOGIN.FILL_ALL_FIELDS'),
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    // Obtém os valores do formulário
    const { username, password } = this.loginForm.value;
    // Vai buscar os utilizadores guardados no storage
    const users = await this.storageService.get('users') || [];

    // Procura um utilizador com o username e password fornecidos
    const userFound = users.find((u: any) =>
      u.username.trim().toLowerCase() === username.trim().toLowerCase() &&
      u.password === password
    );

    if (userFound) {
      // Atualiza o utilizador atual no Storage
      await this.storageService.set('currentUser', userFound);

      // Mostra um toast de sucesso
      const toast = await this.toastCtrl.create({
        message: this.translate.instant('LOGIN.SUCCESS'),
        duration: 150,
        color: 'success'
      });
      await toast.present();

      // Após o toast desaparecer, navega para o dashboard
      toast.onDidDismiss().then(() => {
        this.router.navigateByUrl('/dashboard');
      });
    } else {
      // Se as credenciais estiverem erradas, mostra um toast de erro
      const toast = await this.toastCtrl.create({
        message: this.translate.instant('LOGIN.INVALID_CREDENTIALS'),
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  // Função para navegar para a página de registo
  irParaRegisto() {
    this.router.navigateByUrl('/registo');
  }
}