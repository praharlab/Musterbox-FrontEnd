import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkAddShiftComponent } from './bulk-add-shift.component';

describe('BulkAddShiftComponent', () => {
  let component: BulkAddShiftComponent;
  let fixture: ComponentFixture<BulkAddShiftComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BulkAddShiftComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAddShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
