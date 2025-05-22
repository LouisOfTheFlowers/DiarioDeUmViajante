import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoricoViagemPage } from './historico-viagem.page';

const routes: Routes = [
  {
    path: '',
    component: HistoricoViagemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoricoViagemPageRoutingModule {}
