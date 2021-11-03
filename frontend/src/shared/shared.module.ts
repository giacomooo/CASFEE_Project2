import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponent } from './shared.component';
import { ModalComponent } from './modal/modal.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
  ],
  declarations: [SharedComponent, ModalComponent],
  exports: [ModalComponent]
})
export class SharedModule { }
