import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-shared-button-bar-edit',
  templateUrl: './button-bar-edit.component.html',
  styleUrls: ['./button-bar-edit.component.scss'],
})
export class ButtonBarEditComponent {
  @Input() public backLink?: string;
  @Input() public form?: FormGroup;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  @Input() public object?: any;
  @Input() resetFunction?: () => void;
}
