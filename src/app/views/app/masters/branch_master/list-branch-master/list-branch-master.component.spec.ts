import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListBranchMasterComponent } from './list-branch-master.component';

describe('ListBranchMasterComponent', () => {
  let component: ListBranchMasterComponent;
  let fixture: ComponentFixture<ListBranchMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListBranchMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBranchMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
