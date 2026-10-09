import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTdsSubsectionComponent } from './add-tds-subsection.component';

describe('AddTdsSubsectionComponent', () => {
  let component: AddTdsSubsectionComponent;
  let fixture: ComponentFixture<AddTdsSubsectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTdsSubsectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTdsSubsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
