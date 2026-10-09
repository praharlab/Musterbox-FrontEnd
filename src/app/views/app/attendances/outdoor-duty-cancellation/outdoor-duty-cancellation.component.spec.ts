import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutdoorDutyCancellationComponent } from './outdoor-duty-cancellation.component';

describe('OutdoorDutyCancellationComponent', () => {
  let component: OutdoorDutyCancellationComponent;
  let fixture: ComponentFixture<OutdoorDutyCancellationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OutdoorDutyCancellationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutdoorDutyCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
