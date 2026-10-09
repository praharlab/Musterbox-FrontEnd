import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { EmployeeStatusGraphComponent } from './employee-status-graph/employee-status-graph.component';
import { PunchInOutGraphComponent } from './punch-in-out-graph/punch-in-out-graph.component';
import { RequestBoxComponent } from './request-box/request-box.component';
import { PayrollGraphComponent } from './payroll-graph/payroll-graph.component';
import { MonthAttendanceGraphComponent } from './month-attendance-graph/month-attendance-graph.component';
import { PunchInOutComponent } from './punch-in-out/punch-in-out.component';
import { EmployeeStatusComponent } from './employee-status/employee-status.component';
import { MissPunchComponent } from './miss-punch/miss-punch.component';
import { labelUtils } from 'src/app/constants/labelUtils';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-hr-dashboard',
    templateUrl: './hr-dashboard.component.html',
    styleUrls: ['./hr-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HrDashboardComponent implements OnInit {

  companyData: any = [];
  companyId: string;
  defaultCompany: number;
  activeTabName: string;
  adminRoot: any = environment.adminRoot;

  @ViewChild(EmployeeStatusGraphComponent) employeeStatusGraphComponent: EmployeeStatusGraphComponent;
  @ViewChild(PunchInOutGraphComponent) punchInOutGraphComponent: PunchInOutGraphComponent;
  @ViewChild(RequestBoxComponent) requestBoxComponent: RequestBoxComponent;
  @ViewChild(PayrollGraphComponent) payrollGraphComponent: PayrollGraphComponent;
  @ViewChild(MonthAttendanceGraphComponent) monthAttendanceGraphComponent: MonthAttendanceGraphComponent;
  @ViewChild(PunchInOutComponent) punchInOutComponent: PunchInOutComponent;
  @ViewChild(EmployeeStatusComponent) employeeStatusComponent: EmployeeStatusComponent;
  @ViewChild(MissPunchComponent) missPunchComponent: MissPunchComponent;
  confirmLabel: any = `To Be ${labelUtils.confirmLabel} Employees`
  constructor(
    private api: ApiService,
    private constant: ConstantService,
    private router: Router
  ) { }

  ngOnInit() {
    this.navigate('dashboard');
    this.companyId = localStorage.getItem('company_id');
    this.defaultCompany = +localStorage.getItem('company_id');
    this.getCompany();
  }

  getCompany() {
    const body = {
      companyMasterID: this.companyId,
    };
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.companyData = res.data;
        }
      });
  }

  onCompanyIdChange(event: any) {
    if (!event) {
      return;
    }
    this.companyId = event;

    //PunchInOutGraphComponent
    this.punchInOutGraphComponent.company_id = event;
    this.punchInOutGraphComponent.ngOnDestroy();
    this.punchInOutGraphComponent.getDashboardPunchInOutData();

    //EmployeeStatusGraphComponent
    this.employeeStatusGraphComponent.ngOnDestroy();
    this.employeeStatusGraphComponent.onInitData(event);

    //RequestBoxComponent
    this.requestBoxComponent.getdata(event);

    //PayrollGraphComponent
    this.payrollGraphComponent.defaultValue.companyMasterID = event;
    this.payrollGraphComponent.ngOnDestroy();
    this.payrollGraphComponent.getDashboardSalaryData();

    //MonthAttendanceGraphComponent;
    this.monthAttendanceGraphComponent.defaultValue.companyid = event;
    this.monthAttendanceGraphComponent.ngOnDestroy();
    this.monthAttendanceGraphComponent.getMonthlyAttendaceData();

    //PunchInOutComponent
    this.punchInOutComponent.company_id = event;
    this.punchInOutComponent.selectcompany(event);
    this.punchInOutComponent.body1.companyMasterID = event;
    this.punchInOutComponent.body1.branchMasterID = [];
    this.punchInOutComponent.body1.departmentID = [];
    this.punchInOutComponent.body1.designationID = [];
    this.punchInOutComponent.body1.workingAreaId = [];
    this.punchInOutComponent.body1.divisionId = [];
    this.punchInOutComponent.getdashboardpunchinout();

    //EmployeeStatusGraphComponent
    this.employeeStatusGraphComponent.ngOnDestroy();
    this.employeeStatusComponent.getDashboardEmp(event);

    //MissPunchComponent
    this.missPunchComponent.companyMasterID = event;
    this.missPunchComponent.getMissPunchData();
    this.missPunchComponent.getAllBranches()
  }

  navigate(path: any) {
    if (path == 'dashboard') {
      this.router.navigate([`${this.adminRoot}/dashboards/hr-dashboard`]);
    } else {
      this.router.navigate([`${this.adminRoot}/dashboards/hr-dashboard/${path}`]);
    }
  }
}
