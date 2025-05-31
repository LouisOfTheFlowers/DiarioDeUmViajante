import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FotografiasPageRoutingModule } from './fotografias-routing.module';

import { FotografiasPage } from './fotografias.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FotografiasPageRoutingModule,
    TranslateModule
  ],
  declarations: [FotografiasPage]
})
export class FotografiasPageModule {}
