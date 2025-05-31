import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistoPageRoutingModule } from './registo-routing.module';

import { RegistoPage } from './registo.page';
import { ReactiveFormsModule } from '@angular/forms';


import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RegistoPageRoutingModule,
    TranslateModule
  ],
  declarations: [RegistoPage]
})
export class RegistoPageModule {}
