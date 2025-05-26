import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistarAvaliacaoPage } from './registar-avaliacao.page';

const routes: Routes = [
  {
    path: '',
    component: RegistarAvaliacaoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistarAvaliacaoPageRoutingModule {}
