import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditpayheadmasterComponent } from './editpayheadmaster.component';

describe('EditpayheadmasterComponent', () => {
  let component: EditpayheadmasterComponent;
  let fixture: ComponentFixture<EditpayheadmasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditpayheadmasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditpayheadmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
