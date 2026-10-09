import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditGatepassComponent } from './edit-gatepass.component';

describe('EditGatepassComponent', () => {
  let component: EditGatepassComponent;
  let fixture: ComponentFixture<EditGatepassComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditGatepassComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGatepassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
