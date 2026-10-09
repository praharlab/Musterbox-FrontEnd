import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkAddHolidaypolicyComponent } from './bulk-add-holidaypolicy.component';

describe('BulkAddHolidaypolicyComponent', () => {
  let component: BulkAddHolidaypolicyComponent;
  let fixture: ComponentFixture<BulkAddHolidaypolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BulkAddHolidaypolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAddHolidaypolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
