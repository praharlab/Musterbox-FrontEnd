import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddWeekoffpolicyComponent } from './add-weekoffpolicy.component';

describe('AddWeekoffpolicyComponent', () => {
  let component: AddWeekoffpolicyComponent;
  let fixture: ComponentFixture<AddWeekoffpolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddWeekoffpolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWeekoffpolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
