import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobPostingDataComponent } from './job-posting-data.component';

describe('JobPostingDataComponent', () => {
  let component: JobPostingDataComponent;
  let fixture: ComponentFixture<JobPostingDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobPostingDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPostingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
