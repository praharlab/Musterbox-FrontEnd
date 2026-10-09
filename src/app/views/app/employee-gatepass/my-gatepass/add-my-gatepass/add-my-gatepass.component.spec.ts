import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddMyGatepassComponent } from './add-my-gatepass.component';

describe('AddMyGatepassComponent', () => {
  let component: AddMyGatepassComponent;
  let fixture: ComponentFixture<AddMyGatepassComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMyGatepassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMyGatepassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
