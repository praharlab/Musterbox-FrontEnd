import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyCompensatoryOffComponent } from './my-compensatory-off.component';

describe('MyCompensatoryOffComponent', () => {
  let component: MyCompensatoryOffComponent;
  let fixture: ComponentFixture<MyCompensatoryOffComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCompensatoryOffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCompensatoryOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
