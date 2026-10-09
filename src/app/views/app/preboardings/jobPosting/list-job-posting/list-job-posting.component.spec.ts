import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListJobPostingComponent } from './list-job-posting.component';

describe('ListJobPostingComponent', () => {
  let component: ListJobPostingComponent;
  let fixture: ComponentFixture<ListJobPostingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListJobPostingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListJobPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
