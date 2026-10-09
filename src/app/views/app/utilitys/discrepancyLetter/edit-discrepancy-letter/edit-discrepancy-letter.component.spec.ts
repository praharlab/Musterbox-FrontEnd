import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditDiscrepancyLetterComponent } from './edit-discrepancy-letter.component';

describe('EditDiscrepancyLetterComponent', () => {
  let component: EditDiscrepancyLetterComponent;
  let fixture: ComponentFixture<EditDiscrepancyLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDiscrepancyLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDiscrepancyLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
