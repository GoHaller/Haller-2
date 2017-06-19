import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProblemReport } from './problem-report';
import { HttpClient } from '../../shared/providers/http-client';


@NgModule({
  declarations: [
    ProblemReport,
  ],
  imports: [
    IonicPageModule.forChild(ProblemReport),
  ],
  exports: [
    ProblemReport
  ], 
  providers: [HttpClient]
})
export class ProblemReportModule { }
