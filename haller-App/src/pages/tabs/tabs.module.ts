import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsPage } from './tabs';
import { HttpClient } from '../../shared/providers/http-client';

@NgModule({
  declarations: [
    TabsPage
  ],
  imports: [
    IonicPageModule.forChild(TabsPage),
  ],
  exports: [
    TabsPage
  ],
  providers: [HttpClient]
})
export class TabsModule { }
