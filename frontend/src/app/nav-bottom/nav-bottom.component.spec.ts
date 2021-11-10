/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NavBottomComponent } from './nav-bottom.component';

describe('NavBottomComponent', () => {
  let component: NavBottomComponent;
  let fixture: ComponentFixture<NavBottomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavBottomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
