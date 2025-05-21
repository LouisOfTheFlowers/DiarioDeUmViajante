import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistarViagemPageRoutingModule } from './registar-viagem-routing.module';

import { RegistarViagemPage } from './registar-viagem.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistarViagemPageRoutingModule
  ],
  declarations: [RegistarViagemPage]
})
export class RegistarViagemPageModule {}
