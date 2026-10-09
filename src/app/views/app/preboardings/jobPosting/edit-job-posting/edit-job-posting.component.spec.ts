import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditJobPostingComponent } from './edit-job-posting.component';

describe('EditJobPostingComponent', () => {
  let component: EditJobPostingComponent;
  let fixture: ComponentFixture<EditJobPostingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditJobPostingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditJobPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
