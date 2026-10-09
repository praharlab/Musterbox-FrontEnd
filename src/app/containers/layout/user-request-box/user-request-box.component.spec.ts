import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserRequestBoxComponent } from './user-request-box.component';

describe('UserRequestBoxComponent', () => {
  let component: UserRequestBoxComponent;
  let fixture: ComponentFixture<UserRequestBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRequestBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRequestBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
