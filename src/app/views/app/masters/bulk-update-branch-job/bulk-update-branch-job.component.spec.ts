import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkUpdateBranchJobComponent } from './bulk-update-branch-job.component';

describe('BulkUpdateBranchJobComponent', () => {
  let component: BulkUpdateBranchJobComponent;
  let fixture: ComponentFixture<BulkUpdateBranchJobComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkUpdateBranchJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUpdateBranchJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
