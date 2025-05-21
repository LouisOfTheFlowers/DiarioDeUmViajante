import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistarViagemPage } from './registar-viagem.page';

const routes: Routes = [
  {
    path: '',
    component: RegistarViagemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistarViagemPageRoutingModule {}
