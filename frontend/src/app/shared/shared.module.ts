import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponent } from './shared.component';
import { ModalComponent } from './modal/modal.component';
import { MatButtonModule } from '@angular/material/button';
import { ButtonBarComponent } from './button-bar/button-bar.component';
import { ButtonBarEditComponent } from './button-bar-edit/button-bar-edit.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  declarations: [SharedComponent, ModalComponent, ButtonBarComponent, ButtonBarEditComponent],
  exports: [ModalComponent, ButtonBarComponent, ButtonBarEditComponent]
})
export class SharedModule {
  
}
