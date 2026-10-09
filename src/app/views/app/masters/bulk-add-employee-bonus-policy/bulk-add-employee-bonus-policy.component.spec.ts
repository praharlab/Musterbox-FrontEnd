import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkAddEmployeeBonusPolicyComponent } from './bulk-add-employee-bonus-policy.component';

describe('BulkAddEmployeeBonusPolicyComponent', () => {
  let component: BulkAddEmployeeBonusPolicyComponent;
  let fixture: ComponentFixture<BulkAddEmployeeBonusPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkAddEmployeeBonusPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAddEmployeeBonusPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
