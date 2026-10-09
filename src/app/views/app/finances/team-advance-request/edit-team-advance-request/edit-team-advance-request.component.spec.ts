import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditTeamAdvanceRequestComponent } from './edit-team-advance-request.component';

describe('EditTeamAdvanceRequestComponent', () => {
  let component: EditTeamAdvanceRequestComponent;
  let fixture: ComponentFixture<EditTeamAdvanceRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTeamAdvanceRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTeamAdvanceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
