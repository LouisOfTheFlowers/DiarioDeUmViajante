import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistoviagemPage } from './registoviagem.page';

const routes: Routes = [
  {
    path: '',
    component: RegistoviagemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistoviagemPageRoutingModule {}
