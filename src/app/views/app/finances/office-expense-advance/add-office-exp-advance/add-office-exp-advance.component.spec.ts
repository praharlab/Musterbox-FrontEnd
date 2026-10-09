import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddOfficeExpAdvanceComponent } from './add-office-exp-advance.component';

describe('AddOfficeExpAdvanceComponent', () => {
  let component: AddOfficeExpAdvanceComponent;
  let fixture: ComponentFixture<AddOfficeExpAdvanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOfficeExpAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOfficeExpAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
