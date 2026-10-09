import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditWeekoffpolicyComponent } from './edit-weekoffpolicy.component';

describe('EditWeekoffpolicyComponent', () => {
  let component: EditWeekoffpolicyComponent;
  let fixture: ComponentFixture<EditWeekoffpolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditWeekoffpolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWeekoffpolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
