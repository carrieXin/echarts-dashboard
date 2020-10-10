import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// ngx-bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';

// ngx-echarts
import { NgxEchartsModule } from 'ngx-echarts';

import { ComponentsModule } from './components/components.module';

// pipes
import { GenderPipe } from './pipes/gender.pipe';

const bootstrapModal = [
  ModalModule,
  NgxEchartsModule
];

const pipes = [
  GenderPipe
];


@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    ...bootstrapModal
  ],
  declarations: [...pipes],
  exports: [
    ComponentsModule,
    ...bootstrapModal
  ]
})
export class SharedModule { }
