import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddJobPostingComponent } from './add-job-posting.component';

describe('AddJobPostingComponent', () => {
  let component: AddJobPostingComponent;
  let fixture: ComponentFixture<AddJobPostingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddJobPostingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJobPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
