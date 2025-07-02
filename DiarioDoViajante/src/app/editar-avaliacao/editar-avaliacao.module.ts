import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EditarAvaliacaoPageRoutingModule } from './editar-avaliacao-routing.module';

import { EditarAvaliacaoPage } from './editar-avaliacao.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarAvaliacaoPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [EditarAvaliacaoPage]
})
export class EditarAvaliacaoPageModule {}