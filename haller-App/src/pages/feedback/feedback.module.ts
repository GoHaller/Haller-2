import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Feedback } from './feedback';
import { HttpClient } from '../../shared/providers/http-client';


@NgModule({
  declarations: [
    Feedback,
  ],
  imports: [
    IonicPageModule.forChild(Feedback),
  ],
  exports: [Feedback],
  providers: [HttpClient]
})
export class FeedbackModule { }
