import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReportMasterComponent } from './report-master.component';

describe('ReportMasterComponent', () => {
  let component: ReportMasterComponent;
  let fixture: ComponentFixture<ReportMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ReportMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
