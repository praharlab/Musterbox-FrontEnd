import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyLeaveDataComponent } from './company-leave-data.component';

describe('CompanyLeaveDataComponent', () => {
  let component: CompanyLeaveDataComponent;
  let fixture: ComponentFixture<CompanyLeaveDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyLeaveDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyLeaveDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
