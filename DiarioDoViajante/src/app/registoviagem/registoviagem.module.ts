import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistoviagemPageRoutingModule } from './registoviagem-routing.module';

import { RegistoviagemPage } from './registoviagem.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistoviagemPageRoutingModule
  ],
  declarations: [RegistoviagemPage]
})
export class RegistoviagemPageModule {}
