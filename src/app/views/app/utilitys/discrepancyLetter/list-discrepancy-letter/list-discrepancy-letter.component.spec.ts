import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListDiscrepancyLetterComponent } from './list-discrepancy-letter.component';

describe('ListDiscrepancyLetterComponent', () => {
  let component: ListDiscrepancyLetterComponent;
  let fixture: ComponentFixture<ListDiscrepancyLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDiscrepancyLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDiscrepancyLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
