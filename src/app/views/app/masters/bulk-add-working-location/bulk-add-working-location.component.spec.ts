import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkAddWorkingLocationComponent } from './bulk-add-working-location.component';

describe('BulkAddWorkingLocationComponent', () => {
  let component: BulkAddWorkingLocationComponent;
  let fixture: ComponentFixture<BulkAddWorkingLocationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BulkAddWorkingLocationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAddWorkingLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
