import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportBranchMasterComponent } from './import-branch-master.component';

describe('ImportBranchMasterComponent', () => {
  let component: ImportBranchMasterComponent;
  let fixture: ComponentFixture<ImportBranchMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportBranchMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportBranchMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
