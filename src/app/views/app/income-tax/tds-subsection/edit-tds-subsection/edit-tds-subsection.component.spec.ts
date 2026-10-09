import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditTdsSubsectionComponent } from './edit-tds-subsection.component';

describe('EditTdsSubsectionComponent', () => {
  let component: EditTdsSubsectionComponent;
  let fixture: ComponentFixture<EditTdsSubsectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTdsSubsectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTdsSubsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
