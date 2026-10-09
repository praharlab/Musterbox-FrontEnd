import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditBranchMasterComponent } from './edit-branch-master.component';

describe('EditBranchMasterComponent', () => {
  let component: EditBranchMasterComponent;
  let fixture: ComponentFixture<EditBranchMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditBranchMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBranchMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
