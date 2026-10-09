import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmppenaltyComponent } from './emppenalty.component';

describe('EmppenaltyComponent', () => {
  let component: EmppenaltyComponent;
  let fixture: ComponentFixture<EmppenaltyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmppenaltyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmppenaltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
