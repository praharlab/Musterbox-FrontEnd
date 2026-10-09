import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTdsSubsectionLimitComponent } from './add-tds-subsection-limit.component';

describe('AddTdsSubsectionLimitComponent', () => {
  let component: AddTdsSubsectionLimitComponent;
  let fixture: ComponentFixture<AddTdsSubsectionLimitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTdsSubsectionLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTdsSubsectionLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
