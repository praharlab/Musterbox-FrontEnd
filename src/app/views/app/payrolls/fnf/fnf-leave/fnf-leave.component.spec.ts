import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FnfLeaveComponent } from './fnf-leave.component';

describe('FnfLeaveComponent', () => {
  let component: FnfLeaveComponent;
  let fixture: ComponentFixture<FnfLeaveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FnfLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FnfLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
