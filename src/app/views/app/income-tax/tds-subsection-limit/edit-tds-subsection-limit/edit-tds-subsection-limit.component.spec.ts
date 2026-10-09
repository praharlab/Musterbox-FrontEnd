import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditTdsSubsectionLimitComponent } from './edit-tds-subsection-limit.component';

describe('EditTdsSubsectionLimitComponent', () => {
  let component: EditTdsSubsectionLimitComponent;
  let fixture: ComponentFixture<EditTdsSubsectionLimitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTdsSubsectionLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTdsSubsectionLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
