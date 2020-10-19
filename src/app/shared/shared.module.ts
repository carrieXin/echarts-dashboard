import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// ngx-bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';

// ngx-echarts
import { NgxEchartsModule } from 'ngx-echarts';

// components

// pipes
import { GenderPipe } from './pipes/gender.pipe';

const bootstrapModal = [
  ModalModule,
  NgxEchartsModule
];

const components = [
];

const pipes = [
  GenderPipe
];


@NgModule({
  imports: [
    CommonModule,
    ...bootstrapModal
  ],
  declarations: [...components, ...pipes],
  exports: [
    ...components,
    ...bootstrapModal
  ]
})
export class SharedModule { }
