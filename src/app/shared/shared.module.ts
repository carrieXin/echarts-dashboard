import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// ngx-bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';

// ngx-echarts
import { NgxEchartsModule } from 'ngx-echarts';

// pipes
import { GenderPipe } from './pipes/gender.pipe';
import { ConvertUnitPipe } from './pipes/convert-unit.pipe';

const bootstrapModal = [
  ModalModule,
  NgxEchartsModule
];

const components = [
];

const pipes = [
  GenderPipe,
  ConvertUnitPipe
];


@NgModule({
  imports: [
    CommonModule,
    ...bootstrapModal
  ],
  declarations: [...components, ...pipes],
  exports: [
    ...components,
    ...bootstrapModal,
    ...pipes
  ]
})
export class SharedModule { }
