import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditMyGatepassComponent } from './edit-my-gatepass.component';

describe('EditMyGatepassComponent', () => {
  let component: EditMyGatepassComponent;
  let fixture: ComponentFixture<EditMyGatepassComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMyGatepassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMyGatepassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
