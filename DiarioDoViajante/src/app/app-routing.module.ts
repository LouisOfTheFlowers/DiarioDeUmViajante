import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'registo',
    loadChildren: () => import('./registo/registo.module').then(m => m.RegistoPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'avaliacoes',
    loadChildren: () => import('./avaliacoes/avaliacoes.module').then( m => m.AvaliacoesPageModule)
  },
  {
    path: 'registar-viagem',
    loadChildren: () => import('./registar-viagem/registar-viagem.module').then( m => m.RegistarViagemPageModule)
  },
  {
    path: 'fotografias',
    loadChildren: () => import('./fotografias/fotografias.module').then( m => m.FotografiasPageModule)
  },
  {
    path: 'historico-viagem',
    loadChildren: () => import('./historico-viagem/historico-viagem.module').then( m => m.HistoricoViagemPageModule)
  },  {
    path: 'registar-avaliacao',
    loadChildren: () => import('./registar-avaliacao/registar-avaliacao.module').then( m => m.RegistarAvaliacaoPageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
