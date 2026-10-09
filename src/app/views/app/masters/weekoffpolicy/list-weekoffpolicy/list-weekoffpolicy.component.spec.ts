import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListWeekoffpolicyComponent } from './list-weekoffpolicy.component';

describe('ListWeekoffpolicyComponent', () => {
  let component: ListWeekoffpolicyComponent;
  let fixture: ComponentFixture<ListWeekoffpolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListWeekoffpolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWeekoffpolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
