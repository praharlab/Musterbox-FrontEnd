import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeactiveEmployeeMasterComponent } from './deactive-employee-master.component';

describe('DeactiveEmployeeMasterComponent', () => {
  let component: DeactiveEmployeeMasterComponent;
  let fixture: ComponentFixture<DeactiveEmployeeMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeactiveEmployeeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactiveEmployeeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
