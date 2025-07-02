import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarViagemPage } from './editar-viagem.page';

const routes: Routes = [
  {
    path: '',
    component: EditarViagemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarViagemPageRoutingModule {}
