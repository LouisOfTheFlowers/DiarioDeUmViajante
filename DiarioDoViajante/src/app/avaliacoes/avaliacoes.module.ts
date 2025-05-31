import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvaliacoesPageRoutingModule } from './avaliacoes-routing.module';

import { AvaliacoesPage } from './avaliacoes.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvaliacoesPageRoutingModule,
    TranslateModule
  ],
  declarations: [AvaliacoesPage]
})
export class AvaliacoesPageModule {}
