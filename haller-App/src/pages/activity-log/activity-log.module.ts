import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivityLog } from './activity-log';
import { HttpClient } from '../../shared/providers/http-client';

@NgModule({
  declarations: [
    ActivityLog,
  ],
  imports: [
    IonicPageModule.forChild(ActivityLog),
  ],
  exports: [
    ActivityLog
  ],
  providers: [HttpClient]
})
export class ActivityLogModule { }
