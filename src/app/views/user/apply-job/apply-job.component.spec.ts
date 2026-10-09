import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApplyJobComponent } from './apply-job.component';

describe('ApplyJobComponent', () => {
  let component: ApplyJobComponent;
  let fixture: ComponentFixture<ApplyJobComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
