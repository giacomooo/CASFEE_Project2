import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ModalComponent>) {
    // do nothing
  }

  ngOnInit(): void {
    // do nothing
  }

  actionYes() {
    this.dialogRef.close(true);
  }

  actionNo() {
    this.dialogRef.close(false);
  }
}