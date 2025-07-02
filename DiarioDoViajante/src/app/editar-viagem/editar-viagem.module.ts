import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { EditarViagemPageRoutingModule } from './editar-viagem-routing.module';

import { EditarViagemPage } from './editar-viagem.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarViagemPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    HttpClientModule
  ],
  declarations: [EditarViagemPage]
})
export class EditarViagemPageModule {}