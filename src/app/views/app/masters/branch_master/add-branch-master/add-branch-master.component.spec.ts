import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddBranchMasterComponent } from './add-branch-master.component';

describe('AddBranchMasterComponent', () => {
  let component: AddBranchMasterComponent;
  let fixture: ComponentFixture<AddBranchMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddBranchMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBranchMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
