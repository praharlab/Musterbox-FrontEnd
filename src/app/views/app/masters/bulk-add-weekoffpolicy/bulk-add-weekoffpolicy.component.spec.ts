import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkAddWeekoffpolicyComponent } from './bulk-add-weekoffpolicy.component';

describe('BulkAddWeekoffpolicyComponent', () => {
  let component: BulkAddWeekoffpolicyComponent;
  let fixture: ComponentFixture<BulkAddWeekoffpolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BulkAddWeekoffpolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAddWeekoffpolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
