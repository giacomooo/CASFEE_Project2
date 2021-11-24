import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalDialogData } from '../models/modalDialogData';

@Component({
  selector: 'app-shared-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ModalDialogData, public dialogRef: MatDialogRef<ModalComponent>) {
    // do nothing
  }

  actionYes() {
    this.dialogRef.close(true);
  }

  actionNo() {
    this.dialogRef.close(false);
  }
}
