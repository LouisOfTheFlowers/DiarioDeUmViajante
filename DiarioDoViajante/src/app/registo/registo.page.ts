import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // Importa módulos para formulários reativos
import { Router } from '@angular/router'; // Importa o router para navegação
import { AlertController } from '@ionic/angular'; // Importa o controlador de alertas do Ionic
import { TranslateService } from '@ngx-translate/core'; // Importa o serviço de tradução
import { StorageService } from '../Services/storage.service'; // Usa o novo serviço

@Component({
  selector: 'app-registo', // Seletor do componente
  templateUrl: './registo.page.html', // Caminho para o template HTML
  styleUrls: ['./registo.page.scss'], // Caminho para o ficheiro de estilos SCSS
  standalone: false, // Indica se o componente é standalone
})
export class RegistoPage implements OnInit {
  registoForm!: FormGroup;  // Formulário reativo para registo
  darkMode = false; // Estado do modo escuro
  linguaSelecionada = 'pt'; // Idioma selecionado

  // Injeta os serviços necessários no construtor
  constructor(
    private fb: FormBuilder, // FormBuilder para criar o formulário
    private alertCtrl: AlertController, // Controlador de alertas
    private router: Router, // Router para navegação
    private translate: TranslateService, // Serviço de tradução
    private storageService: StorageService // Usa o novo serviço
  ) {}

  // Inicializa o formulário e aplica preferências de tema e idioma ao iniciar o componente
  async ngOnInit() {
    this.createForm();

    // Verifica se o modo escuro está ativo e aplica
    const saved = localStorage.getItem('darkMode') === 'true';
    this.darkMode = saved;
    if (saved) {
      document.body.classList.add('dark-theme');
    }

    // Define o idioma guardado ou 'pt' por defeito
    const lang = localStorage.getItem('lang') || 'pt';
    this.linguaSelecionada = lang;
    this.translate.use(lang);
  }

  // Cria o formulário de registo com validação
  createForm() {
    this.registoForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  // Função chamada ao submeter o formulário de registo
  async registar() {
    // Valida se o formulário está correto
    if (this.registoForm.invalid) {
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('REGISTO.ERRO'),
        message: this.translate.instant('REGISTO.PREENCHA_TODOS_OS_CAMPOS'),
        buttons: [this.translate.instant('OK')],
      });
      await alert.present();
      return;
    }

    // Obtém os valores do formulário
    const { username, email, password, confirmPassword } = this.registoForm.value;

    // Verifica se as passwords coincidem
    if (password !== confirmPassword) {
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('REGISTO.ERRO'),
        message: this.translate.instant('REGISTO.Passwords_Nao_Coincidem'),
        buttons: [this.translate.instant('OK')],
      });
      await alert.present();
      return;
    }

    // Cria o novo utilizador e guarda no storage
    const user = { username, email, password };
    const users = await this.storageService.get('users') || [];
    users.push(user);
    await this.storageService.set('users', users);

    // Gera e faz download de um ficheiro txt com os utilizadores
    this.generateTxt(users);

    // Mostra mensagem de sucesso
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('REGISTO.SUCESSO'),
      message: this.translate.instant('REGISTO.CONTA_CRIADA_SUCESSO'),
      buttons: [this.translate.instant('REGISTO.OK')],
    });
    await alert.present();

    // Navega para a página de login
    this.router.navigate(['/home']);
  }

  // Gera e faz download de um ficheiro txt com os utilizadores registados
  generateTxt(users: any[]) {
    const content = users.map(u => `Username: ${u.username}, Email: ${u.email}, Password: ${u.password}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.txt';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  // Ativa ou desativa o modo escuro
  toggleDarkMode(event: any) {
    const isDark = event.detail.checked;
    document.body.classList.toggle('dark-theme', isDark);
    localStorage.setItem('darkMode', isDark ? 'true' : 'false');
  }

  // Troca o idioma da aplicação
  trocarIdioma(novoIdioma: string) {
    if (!novoIdioma) return;
    this.linguaSelecionada = novoIdioma;
    this.translate.use(novoIdioma);
    localStorage.setItem('lang', novoIdioma);
  }
}