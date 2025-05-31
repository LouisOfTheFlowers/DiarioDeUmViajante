import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistoPage } from './registo.page';

const routes: Routes = [
  {
    path: '',
    component: RegistoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistoPageRoutingModule {}
