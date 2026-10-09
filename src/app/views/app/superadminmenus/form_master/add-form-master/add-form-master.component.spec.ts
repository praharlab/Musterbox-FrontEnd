import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddFormMasterComponent } from './add-form-master.component';

describe('AddFormMasterComponent', () => {
  let component: AddFormMasterComponent;
  let fixture: ComponentFixture<AddFormMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddFormMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFormMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
