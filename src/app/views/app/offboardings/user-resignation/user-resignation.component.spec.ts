import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserResignationComponent } from './user-resignation.component';

describe('UserResignationComponent', () => {
  let component: UserResignationComponent;
  let fixture: ComponentFixture<UserResignationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserResignationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserResignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
