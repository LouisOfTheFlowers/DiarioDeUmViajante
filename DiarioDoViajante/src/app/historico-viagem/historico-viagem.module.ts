import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoricoViagemPageRoutingModule } from './historico-viagem-routing.module';

import { HistoricoViagemPage } from './historico-viagem.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoricoViagemPageRoutingModule,
    TranslateModule
  ],
  declarations: [HistoricoViagemPage]
})
export class HistoricoViagemPageModule {}
