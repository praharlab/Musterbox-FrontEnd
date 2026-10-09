import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddCallFollowupComponent } from './add-call-followup.component';

describe('AddCallFollowupComponent', () => {
  let component: AddCallFollowupComponent;
  let fixture: ComponentFixture<AddCallFollowupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddCallFollowupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCallFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
