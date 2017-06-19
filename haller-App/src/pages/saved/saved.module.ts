import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { HttpClient } from '../../shared/providers/http-client';
import { Saved } from './saved';
import { SavedProvider } from './saved.provider';

@NgModule({
  declarations: [
    Saved,
  ],
  imports: [
    IonicPageModule.forChild(Saved),
  ],
  exports: [
    Saved
  ],
  providers:[
    SavedProvider, HttpClient
  ]
})
export class SavedModule {}
