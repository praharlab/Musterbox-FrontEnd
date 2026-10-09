import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTerminationLetterComponent } from './add-termination-letter.component';

describe('AddTerminationLetterComponent', () => {
  let component: AddTerminationLetterComponent;
  let fixture: ComponentFixture<AddTerminationLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTerminationLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTerminationLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
