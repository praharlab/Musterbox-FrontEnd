import { NgModule } from '@angular/core';

import { MastersRoutingModule } from './masters.routing';

import { CommonModule, DatePipe } from '@angular/common';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxPrintModule } from 'ngx-print';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { QuillModule } from 'ngx-quill';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { PagesContainersModule } from '../../../containers/pages/pages.containers.module';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxSignaturePadModule } from 'src/app/components/signature-pad/ngx-signature-pad.module';
import { QRCodeComponent } from 'angularx-qrcode';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { ComponentsChartModule } from 'src/app/components/charts/components.charts.module';
import { AgmCoreModule } from 'src/app/components/agm/agm.module';
import { BnNgTreeModule } from 'src/app/components/bn-ng-tree/bn-ng-tree.module';
import { AgmDirectionModule } from 'src/app/components/agm/agm.module';

import { MastersComponent } from './masters.component';
import { MasterComponent } from './master/master.component';

import { ListCompanyContactComponent } from './company_contact/list-company-contact/list-company-contact.component';
import { EditEmployeeMasterComponent } from './employee_master/edit-employee-master/edit-employee-master.component';
import { AddCompanyContactComponent } from './company_contact/add-company-contact/add-company-contact.component';
import { EditCompanyContactComponent } from './company_contact/edit-company-contact/edit-company-contact.component';
import { ListEmployeeMasterComponent } from './employee_master/list-employee-master/list-employee-master.component';

import { EmployeeJoiningComponent } from './employee_master/employee-joining/employee-joining.component';
import { DashboardsContainersModule } from 'src/app/containers/dashboards/dashboards.containers.module';
import { EmployeeResignationComponent } from './employee_master/employee-resignation/employee-resignation.component';
import { ListEmployeeIncrementComponent } from './employee_master/list-employee-increment/list-employee-increment.component';
import { ListDigitalSignatureComponent } from './employee_master/list-digital-signature/list-digital-signature.component';
import { ListEmployeeHolidaypolicyComponent } from './employee_master/list-employee-holidaypolicy/list-employee-holidaypolicy.component';
import { ListEmployeeShiftComponent } from './employee_master/list-employee-shift/list-employee-shift.component';

import { ListEmployeeLetterComponent } from './employee_master/list-employee-letter/list-employee-letter.component';
import { ListEmployeeLeaveBalComponent } from './employee_master/list-employee-leave-bal/list-employee-leave-bal.component';
import { ListEmployeeSalarydetailComponent } from './employee_master/list-employee-salarydetail/list-employee-salarydetail.component';
import { ListEmployeeCompanyDocumentComponent } from './employee_master/list-employee-company-document/list-employee-company-document.component';
import { ListEmployeeWeekoffpolicyComponent } from './employee_master/list-employee-weekoffpolicy/list-employee-weekoffpolicy.component';
import { ListEmployeeSalaryPolicyComponent } from './employee_master/list-employee-salary-policy/list-employee-salary-policy.component';
import { ListEmployeeAttendancePolicyComponent } from './employee_master/list-employee-attendance-policy/list-employee-attendance-policy.component';
import { ListEmployeeDesignationComponent } from './employee_master/list-employee-designation/list-employee-designation.component';
import { ListEmployeeDepartmentComponent } from './employee_master/list-employee-department/list-employee-department.component';
import { ListEmployeeBranchComponent } from './employee_master/list-employee-branch/list-employee-branch.component';
import { ListEmployeeReportstoComponent } from './employee_master/list-employee-reportsto/list-employee-reportsto.component';
import { ListEmployeeSkillsComponent } from './employee_master/list-employee-skills/list-employee-skills.component';
import { ListEmployeeFamilyComponent } from './employee_master/list-employee-family/list-employee-family.component';
import { ListEmployeeDocumentsComponent } from './employee_master/list-employee-documents/list-employee-documents.component';
import { ListEmployeeEducationComponent } from './employee_master/list-employee-education/list-employee-education.component';
import { ListEmployeeExperianceComponent } from './employee_master/list-employee-experiance/list-employee-experiance.component';
import { ListEmployeeAddressComponent } from './employee_master/list-employee-address/list-employee-address.component';
import { ViewAttedancePolicyComponent } from './employee_master/list-employee-attendance-policy/view-attedance-policy/view-attedance-policy.component';
import { ViewSalaryPolicyComponent } from './employee_master/list-employee-salary-policy/view-salary-policy/view-salary-policy.component';
import { ViewWeekOffPolicyComponent } from './employee_master/list-employee-weekoffpolicy/view-week-off-policy/view-week-off-policy.component';
import { ViewHolidayPolicyComponent } from './employee_master/list-employee-holidaypolicy/view-holiday-policy/view-holiday-policy.component';

import { ListEmployeeWorkinglocationComponent } from './employee_master/list-employee-workinglocation/list-employee-workinglocation.component';
import { ListEmployeeAuthorizationComponent } from './employee_master/list-employee-authorization/list-employee-authorization.component';
import { ListEmployeeLateEarlyPolicyComponent } from './employee_master/list-employee-late-early-policy/list-employee-late-early-policy.component';

import { ViewLateEarlyPolicyComponent } from './employee_master/list-employee-late-early-policy/view-late-early-policy/view-late-early-policy.component';

import { ListEmployeeDivisionComponent } from './employee_master/list-employee-division/list-employee-division.component';
import { ListEmployeeWorkingareaComponent } from './employee_master/list-employee-workingarea/list-employee-workingarea.component';

import { ListEmployeeAttendanceBonusPolicyComponent } from './employee_master/list-employee-attendance-bonus-policy/list-employee-attendance-bonus-policy.component';

import { ViewAttendanceBonusPolicyComponent } from './employee_master/list-employee-attendance-bonus-policy/view-attendance-bonus-policy/view-attendance-bonus-policy.component';

import { ListEmployeeFoodAllowancePolicyComponent } from './employee_master/list-employee-food-allowance-policy/list-employee-food-allowance-policy.component';
import { ViewFoodAllowancePolicyComponent } from './employee_master/list-employee-food-allowance-policy/view-food-allowance-policy/view-food-allowance-policy.component';

import { ListEmpLeavePolicyComponent } from './employee_master/list-emp-leave-policy/list-emp-leave-policy.component'

import { ListUniformDetailComponent } from './employee_master/list-uniform-detail/list-uniform-detail.component';

import { DeleteEmployeeMasterComponent } from './employee_master/delete-employee-master/delete-employee-master.component';
import { ListReportstoDataComponent } from './employee_master/list-reportsto-data/list-reportsto-data.component';
import { ListAuthorizationDataComponent } from './employee_master/list-authorization-data/list-authorization-data.component';
import { DeactiveEmployeeMasterComponent } from './employee_master/deactive-employee-master/deactive-employee-master.component';
import { BulkInitialLeaveOpeingBalanceComponent } from './bulk-initial-leave-opeing-balance/bulk-initial-leave-opeing-balance.component';
import { ListJoiningDocumentDataComponent } from './employee_master/list-joining-document-data/list-joining-document-data.component';
import { RequestCommonModule } from '../request-common/request-common.module';
import { ListEmployeeDiscrepancyLetterComponent } from './employee_master/list-employee-discrepancy-letter/list-employee-discrepancy-letter.component';
import { PersonalFormComponent } from './employee_master/personal-form/personal-form.component';
import { AttendancePolicyMasterModule } from './attendancepolicy/attendance-policy-master.module';
import { EmployeeWeekoffPolicyMasterModule } from './employee-weekoff-policy/employee-weekoff-policy-master.module';
import { EmpShortLeavePolicyMasterModule } from './employee_master/list-emp-short-leave-policy/emp-short-leave-policy-master.module';
import { EmployeeFoodAllowancePolicyMasterModule } from './employee-foodAllowance-policy/employee-food-allowance-policy-master/employee-food-allowance-policy-master.module';
import { EmployeeIdcardMasterModule } from './employee_master/employee-id-card/employee-idcard-master.module';
import { ListEmployeeProjectComponent } from './employee_master/list-employee-project/list-employee-project.component';
import { ListUserDataMasterModule } from './employee_master/list-user-data/list-user-data-master.module';
import { ListEmployeeBonusPolicyComponent } from './employee_master/list-employee-bonus-policy/list-employee-bonus-policy.component';
import { ViewEmployeeBonusPolicyComponent } from './employee_master/list-employee-bonus-policy/view-employee-bonus-policy/view-employee-bonus-policy.component';
import { BulkUpdateBranchJobComponent } from './bulk-update-branch-job/bulk-update-branch-job.component';
import { CommonFilterModule } from '../common-filter/common-filter.module';

@NgModule({
  declarations: [
    MastersComponent,
    MasterComponent,

    ListEmployeeMasterComponent,
    EditEmployeeMasterComponent,
    AddCompanyContactComponent,
    ListCompanyContactComponent,
    EditCompanyContactComponent,

    EmployeeJoiningComponent,
    EmployeeResignationComponent,
    ListEmployeeIncrementComponent,
    ListEmployeeLetterComponent,
    ListEmployeeLeaveBalComponent,
    ListEmployeeSalarydetailComponent,
    ListDigitalSignatureComponent,
    ListEmployeeCompanyDocumentComponent,
    ListEmployeeHolidaypolicyComponent,
    ListEmployeeWeekoffpolicyComponent,
    ListEmployeeSalaryPolicyComponent,
    ListEmployeeAttendancePolicyComponent,
    ListEmployeeShiftComponent,
    ListEmployeeDesignationComponent,
    ListEmployeeDepartmentComponent,
    ListEmployeeBranchComponent,
    ListEmployeeReportstoComponent,
    ListEmployeeSkillsComponent,
    ListEmployeeFamilyComponent,
    ListEmployeeDocumentsComponent,
    ListEmployeeEducationComponent,
    ListEmployeeExperianceComponent,
    ListEmployeeAddressComponent,

    ViewAttedancePolicyComponent,
    ViewSalaryPolicyComponent,
    ViewWeekOffPolicyComponent,
    ViewHolidayPolicyComponent,

    ListEmployeeWorkinglocationComponent,
    ListEmployeeAuthorizationComponent,
    ListEmployeeLateEarlyPolicyComponent,
    ViewLateEarlyPolicyComponent,

    ListEmployeeDivisionComponent,
    ListEmployeeWorkingareaComponent,
    ListEmployeeAttendanceBonusPolicyComponent,
    ViewAttendanceBonusPolicyComponent,

    ListEmployeeFoodAllowancePolicyComponent,
    ViewFoodAllowancePolicyComponent,
    ListEmpLeavePolicyComponent,
    ListUniformDetailComponent,
    DeleteEmployeeMasterComponent,
    ListReportstoDataComponent,
    ListAuthorizationDataComponent,
    DeactiveEmployeeMasterComponent,
    BulkInitialLeaveOpeingBalanceComponent,
    ListJoiningDocumentDataComponent,
    ListEmployeeDiscrepancyLetterComponent,
    PersonalFormComponent,
    ListEmployeeProjectComponent,
    ListEmployeeBonusPolicyComponent,
    ViewEmployeeBonusPolicyComponent,
    BulkUpdateBranchJobComponent,

    
    
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    AngularDualListBoxModule,
    NgMultiSelectDropDownModule.forRoot(),
    MastersRoutingModule,
    ModalModule,
    FormsModule,
    SharedModule,
    LayoutContainersModule,
    NgxDatatableModule,
    PagesContainersModule,
    CollapseModule,
    PaginationModule,
    TabsModule,
    TooltipModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot(),
    QuillModule.forRoot(),
    NgxUiLoaderModule,
    NgxPrintModule,
    BsDatepickerModule,
    TimepickerModule,
    NgxMaterialTimepickerModule,
    ComponentsStateButtonModule,
    NgxSignaturePadModule,
    QRCodeComponent,
    PdfViewerModule,
    BnNgTreeModule,
    NgCircleProgressModule.forRoot(),
    AgmDirectionModule,
    NgxPrintModule,
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyAQyXIWhOoRo6rj0PcaYdEbVTSiu2EHiq4',
    }),
    ComponentsChartModule,
    DashboardsContainersModule,
    RequestCommonModule,
    AttendancePolicyMasterModule,
    EmployeeWeekoffPolicyMasterModule,
    EmpShortLeavePolicyMasterModule,
    EmployeeFoodAllowancePolicyMasterModule,
    EmployeeIdcardMasterModule,
    ListUserDataMasterModule,
    CommonFilterModule
],
  exports: [
  ],
})
export class MastersModule { }
