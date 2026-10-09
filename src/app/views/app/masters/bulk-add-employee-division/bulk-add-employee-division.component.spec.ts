import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkAddEmployeeDivisionComponent } from './bulk-add-employee-division.component';

describe('BulkAddEmployeeDivisionComponent', () => {
  let component: BulkAddEmployeeDivisionComponent;
  let fixture: ComponentFixture<BulkAddEmployeeDivisionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkAddEmployeeDivisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAddEmployeeDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
