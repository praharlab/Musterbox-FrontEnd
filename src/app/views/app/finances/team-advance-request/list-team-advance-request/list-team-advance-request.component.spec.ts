import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListTeamAdvanceRequestComponent } from './list-team-advance-request.component';

describe('ListTeamAdvanceRequestComponent', () => {
  let component: ListTeamAdvanceRequestComponent;
  let fixture: ComponentFixture<ListTeamAdvanceRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTeamAdvanceRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTeamAdvanceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
