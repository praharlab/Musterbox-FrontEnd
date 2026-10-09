import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyPaySlipComponent } from './my-pay-slip.component';

describe('MyPaySlipComponent', () => {
  let component: MyPaySlipComponent;
  let fixture: ComponentFixture<MyPaySlipComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPaySlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPaySlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
