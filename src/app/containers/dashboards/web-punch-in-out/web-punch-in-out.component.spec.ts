import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WebPunchInOutComponent } from './web-punch-in-out.component';

describe('WebPunchInOutComponent', () => {
  let component: WebPunchInOutComponent;
  let fixture: ComponentFixture<WebPunchInOutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WebPunchInOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebPunchInOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
