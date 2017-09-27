import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TermsofService } from './terms-of-service';

@NgModule({
  declarations: [
    TermsofService,
  ],
  imports: [
    IonicPageModule.forChild(TermsofService),
  ],
  exports: [
    TermsofService
  ]
})
export class TermsofServiceModule { }
