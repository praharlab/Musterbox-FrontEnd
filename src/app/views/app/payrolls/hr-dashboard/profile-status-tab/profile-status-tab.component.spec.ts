import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfileStatusTabComponent } from './profile-status-tab.component';

describe('ProfileStatusTabComponent', () => {
  let component: ProfileStatusTabComponent;
  let fixture: ComponentFixture<ProfileStatusTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileStatusTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileStatusTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
