import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditFormMasterComponent } from './edit-form-master.component';

describe('EditFormMasterComponent', () => {
  let component: EditFormMasterComponent;
  let fixture: ComponentFixture<EditFormMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditFormMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFormMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
