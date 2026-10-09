import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddleaveTypesComponent } from './addleave-types.component';

describe('AddleaveTypesComponent', () => {
  let component: AddleaveTypesComponent;
  let fixture: ComponentFixture<AddleaveTypesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddleaveTypesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddleaveTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
