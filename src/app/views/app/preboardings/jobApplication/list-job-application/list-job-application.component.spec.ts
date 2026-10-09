import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListJobApplicationComponent } from './list-job-application.component';

describe('ListJobApplicationComponent', () => {
  let component: ListJobApplicationComponent;
  let fixture: ComponentFixture<ListJobApplicationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListJobApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListJobApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
