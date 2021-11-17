import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-shared-button-bar-edit',
  templateUrl: './button-bar-edit.component.html',
  styleUrls: ['./button-bar-edit.component.scss']
})
export class ButtonBarEditComponent implements OnInit {
  @Input() public backLink?: String;
  @Input() public form?: FormGroup;
  @Input() public object?: any;
  @Input() resetFunction?: () => void;

  constructor() {  }

  ngOnInit(): void {
  }

}
