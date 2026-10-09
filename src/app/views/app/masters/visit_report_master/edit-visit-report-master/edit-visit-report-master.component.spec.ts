import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditVisitReportMasterComponent } from './edit-visit-report-master.component';

describe('EditVisitReportMasterComponent', () => {
  let component: EditVisitReportMasterComponent;
  let fixture: ComponentFixture<EditVisitReportMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditVisitReportMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVisitReportMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
