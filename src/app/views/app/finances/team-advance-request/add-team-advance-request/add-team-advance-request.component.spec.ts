import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTeamAdvanceRequestComponent } from './add-team-advance-request.component';

describe('AddTeamAdvanceRequestComponent', () => {
  let component: AddTeamAdvanceRequestComponent;
  let fixture: ComponentFixture<AddTeamAdvanceRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTeamAdvanceRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTeamAdvanceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
