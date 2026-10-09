import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListServiceChargeComponent } from './list-service-charge.component';

describe('ListServiceChargeComponent', () => {
  let component: ListServiceChargeComponent;
  let fixture: ComponentFixture<ListServiceChargeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListServiceChargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListServiceChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
