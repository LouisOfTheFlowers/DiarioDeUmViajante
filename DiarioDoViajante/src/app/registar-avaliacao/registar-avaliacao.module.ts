import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistarAvaliacaoPageRoutingModule } from './registar-avaliacao-routing.module';

import { RegistarAvaliacaoPage } from './registar-avaliacao.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistarAvaliacaoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegistarAvaliacaoPage]
})
export class RegistarAvaliacaoPageModule {}
