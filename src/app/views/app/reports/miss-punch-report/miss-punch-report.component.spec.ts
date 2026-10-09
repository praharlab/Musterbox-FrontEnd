import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MissPunchReportComponent } from './miss-punch-report.component';

describe('MissPunchReportComponent', () => {
  let component: MissPunchReportComponent;
  let fixture: ComponentFixture<MissPunchReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MissPunchReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissPunchReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
