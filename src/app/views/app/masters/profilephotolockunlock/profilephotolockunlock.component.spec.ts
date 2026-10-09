import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfilephotolockunlockComponent } from './profilephotolockunlock.component';

describe('ProfilephotolockunlockComponent', () => {
  let component: ProfilephotolockunlockComponent;
  let fixture: ComponentFixture<ProfilephotolockunlockComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilephotolockunlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilephotolockunlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
