import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GiphyModel } from './giphy-model';

@NgModule({
  declarations: [
    GiphyModel,
  ],
  imports: [
    IonicPageModule.forChild(GiphyModel),
  ],
  exports: [
    GiphyModel
  ]
})
export class GiphyModelModule {}
