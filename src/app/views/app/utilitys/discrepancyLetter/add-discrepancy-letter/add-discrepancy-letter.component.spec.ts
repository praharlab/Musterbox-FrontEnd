import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddDiscrepancyLetterComponent } from './add-discrepancy-letter.component';

describe('AddDiscrepancyLetterComponent', () => {
  let component: AddDiscrepancyLetterComponent;
  let fixture: ComponentFixture<AddDiscrepancyLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDiscrepancyLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDiscrepancyLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
