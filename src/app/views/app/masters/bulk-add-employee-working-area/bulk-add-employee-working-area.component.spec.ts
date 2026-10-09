import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkAddEmployeeWorkingAreaComponent } from './bulk-add-employee-working-area.component';

describe('BulkAddEmployeeWorkingAreaComponent', () => {
  let component: BulkAddEmployeeWorkingAreaComponent;
  let fixture: ComponentFixture<BulkAddEmployeeWorkingAreaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkAddEmployeeWorkingAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAddEmployeeWorkingAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
