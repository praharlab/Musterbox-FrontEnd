import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ToBeConfirmedEmployeeTabComponent } from './to-be-confirmed-employee-tab.component';

describe('ToBeConfirmedEmployeeTabComponent', () => {
  let component: ToBeConfirmedEmployeeTabComponent;
  let fixture: ComponentFixture<ToBeConfirmedEmployeeTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ToBeConfirmedEmployeeTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToBeConfirmedEmployeeTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
