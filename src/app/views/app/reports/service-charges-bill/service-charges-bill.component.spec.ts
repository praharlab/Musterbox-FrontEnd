import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServiceChargesBillComponent } from './service-charges-bill.component';

describe('ServiceChargesBillComponent', () => {
  let component: ServiceChargesBillComponent;
  let fixture: ComponentFixture<ServiceChargesBillComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceChargesBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceChargesBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
