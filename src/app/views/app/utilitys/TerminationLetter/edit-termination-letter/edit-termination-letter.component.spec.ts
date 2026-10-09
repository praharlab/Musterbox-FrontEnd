import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditTerminationLetterComponent } from './edit-termination-letter.component';

describe('EditTerminationLetterComponent', () => {
  let component: EditTerminationLetterComponent;
  let fixture: ComponentFixture<EditTerminationLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTerminationLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTerminationLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
