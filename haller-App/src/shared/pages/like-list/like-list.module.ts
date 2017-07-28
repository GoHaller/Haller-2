import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LikeListPage } from './like-list';

@NgModule({
  declarations: [
    LikeListPage,
  ],
  imports: [
    IonicPageModule.forChild(LikeListPage),
  ],
  exports: [
    LikeListPage
  ]
})
export class LikeListPageModule { }
