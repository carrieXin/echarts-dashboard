import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// modules
import { SharedModule } from '../../shared/shared.module';
import { NgxEchartsModule } from "ngx-echarts";
import { JoyrideModule } from 'ngx-joyride';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    NgxEchartsModule,
    JoyrideModule.forRoot()
  ]
})
export class DashboardModule { }
