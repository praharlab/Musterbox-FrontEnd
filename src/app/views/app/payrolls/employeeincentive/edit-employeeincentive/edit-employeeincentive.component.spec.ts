import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditEmployeeincentiveComponent } from './edit-employeeincentive.component';

describe('EditEmployeeincentiveComponent', () => {
  let component: EditEmployeeincentiveComponent;
  let fixture: ComponentFixture<EditEmployeeincentiveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditEmployeeincentiveComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeeincentiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
