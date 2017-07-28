import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Lists } from './lists';
import { ProfileProvider } from "../../providers/profile.provider";

@NgModule({
  declarations: [
    Lists,
  ],
  imports: [
    IonicPageModule.forChild(Lists),
  ],
  exports: [
    Lists
  ],
  providers: [ProfileProvider]
})
export class ListsModule { }
