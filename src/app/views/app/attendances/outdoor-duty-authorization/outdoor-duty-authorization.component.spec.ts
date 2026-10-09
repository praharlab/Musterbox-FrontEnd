import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutdoorDutyAuthorizationComponent } from './outdoor-duty-authorization.component';

describe('OutdoorDutyAuthorizationComponent', () => {
  let component: OutdoorDutyAuthorizationComponent;
  let fixture: ComponentFixture<OutdoorDutyAuthorizationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OutdoorDutyAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutdoorDutyAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
