import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyIncentiveComponent } from './my-incentive.component';

describe('MyIncentiveComponent', () => {
  let component: MyIncentiveComponent;
  let fixture: ComponentFixture<MyIncentiveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyIncentiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyIncentiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
