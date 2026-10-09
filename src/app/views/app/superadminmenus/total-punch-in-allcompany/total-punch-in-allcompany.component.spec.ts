import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TotalPunchInAllcompanyComponent } from './total-punch-in-allcompany.component';

describe('TotalPunchInAllcompanyComponent', () => {
  let component: TotalPunchInAllcompanyComponent;
  let fixture: ComponentFixture<TotalPunchInAllcompanyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalPunchInAllcompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalPunchInAllcompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
