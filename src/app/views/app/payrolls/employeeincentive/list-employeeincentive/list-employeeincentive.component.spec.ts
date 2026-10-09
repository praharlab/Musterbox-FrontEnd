import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeincentiveComponent } from './list-employeeincentive.component';

describe('ListEmployeeincentiveComponent', () => {
  let component: ListEmployeeincentiveComponent;
  let fixture: ComponentFixture<ListEmployeeincentiveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeincentiveComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeincentiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
