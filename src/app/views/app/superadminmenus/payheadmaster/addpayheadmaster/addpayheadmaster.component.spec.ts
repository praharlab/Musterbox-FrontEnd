import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddpayheadmasterComponent } from './addpayheadmaster.component';

describe('AddpayheadmasterComponent', () => {
  let component: AddpayheadmasterComponent;
  let fixture: ComponentFixture<AddpayheadmasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddpayheadmasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpayheadmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
