import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewEmpBonusDetailsComponent } from './view-emp-bonus-details.component';

describe('ViewEmpBonusDetailsComponent', () => {
  let component: ViewEmpBonusDetailsComponent;
  let fixture: ComponentFixture<ViewEmpBonusDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEmpBonusDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEmpBonusDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
