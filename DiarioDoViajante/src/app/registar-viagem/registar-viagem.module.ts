import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { RegistarViagemPageRoutingModule } from './registar-viagem-routing.module';

import { RegistarViagemPage } from './registar-viagem.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistarViagemPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    HttpClientModule
  ],
  declarations: [RegistarViagemPage]
})
export class RegistarViagemPageModule {}
