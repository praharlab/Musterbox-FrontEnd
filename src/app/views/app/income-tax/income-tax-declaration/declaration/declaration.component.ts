import { Component, ViewChild, OnInit, ViewContainerRef, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { EmployeeIncomeFromOtherSourcesComponent } from '../employee-income-from-other-sources/employee-income-from-other-sources.component';
import { EmployeeHousePropertyComponent } from '../employee-house-property/employee-house-property.component';
import { EmployeeDeclarationDeductionsAlloancesComponent } from '../employee-declaration-deductions-alloances/employee-declaration-deductions-alloances.component';
import { EmployeeDeclarationComponent } from '../employee-declaration/employee-declaration.component';
import { Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';

import { IncomeTaxComputationComponent } from '../income-tax-computation/income-tax-computation.component';



@Component({
    selector: 'app-declaration',
    templateUrl: './declaration.component.html',
    styleUrls: ['./declaration.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})


export class DeclarationComponent implements OnInit {
  @ViewChild('componentContainer', { read: ViewContainerRef })
  componentContainer: ViewContainerRef;

  myDeclarationData = {
    sectionName: 'My Declarations',
    sectionInfo: 'Below are the declarations done by you under various sections.',
  };

  selectedFiscalYear: string
  selectedTabLabel: { heading: string; data: any, tdsSubSectionCategoryID: any };
  categorydata: any = [];
  financialYears: any[];
  currentFYyear: string;

  @ViewChild(EmployeeDeclarationComponent)
  employeeDeclarationComponent: EmployeeDeclarationComponent;
  permissiondelete: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissioncreate: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,

    private router: Router,
    private notifications: AppNotificationService,
  ) { }

  ngOnInit(): void {
    this.checkpermission();
    this.getFinancialYears();
    //  this.selectedFiscalYear = this.getCurrentFinancialYear(currentDate);
    this.getCategoryData();

  }


  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;

          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyIncometaxDeclaration' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyIncometaxDeclaration' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyIncometaxDeclaration' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyIncometaxDeclaration' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }


  getFinancialYears() {

    this.spinner.start('financialyear');
    this.api.callApi(this.constant.GETFINANCIALYEARS, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.financialYears = res.data
          // to selected current financial year
          this.selectedFiscalYear = this.financialYears[1]

        } else {
          this.handleError('Something Went Wrong!');

        }
        this.spinner.stop('financialyear');
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('financialyear');
      },
    );

  }

  private getCategoryData() {
    this.spinner.start('company');
    this.api.callApi(this.constant.GETTDSSUBSECTIONCATEGORYLIST, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.categorydata = res.data;

          this.categorydata.map(e => {
            if (e.tdsSubSectionCategoryID == 1) {
              e.loadComponent = EmployeeDeclarationDeductionsAlloancesComponent,
                e.data = {
                  sectionName: e.categoryName,
                  sectionInfo:
                    'The total income earned from sources other than salary, house property, business or profession, and capital gains, including interest income, dividend income, rental income, and any other miscellaneous income, subjected to taxation as per the applicable tax laws.',

                }
            } else if (e.tdsSubSectionCategoryID == 2) {
              e.loadComponent = EmployeeDeclarationDeductionsAlloancesComponent,
                e.data = {
                  sectionName: e.categoryName,
                  sectionInfo:
                    'The aggregate amount of allowances and deductions permitted under various sections of the Income Tax Act, such as HRA (House Rent Allowance), LTA (Leave Travel Allowance), medical allowances, and other permissible exemptions, aimed at reducing taxable income.',
                }
            } else if (e.tdsSubSectionCategoryID == 3) {
              e.loadComponent = EmployeeDeclarationDeductionsAlloancesComponent,
                e.data = {
                  sectionName: e.categoryName,
                  sectionInfo:
                    'The total income earned from sources other than salary, house property, business or profession, and capital gains, including interest income, dividend income, rental income, and any other miscellaneous income, subjected to taxation as per the applicable tax laws.',
                }
            } else if (e.tdsSubSectionCategoryID == 4) {
              e.loadComponent = EmployeeHousePropertyComponent,
                e.data = {
                  sectionName: e.categoryName,
                  sectionInfo:
                    'Income from other sources is a residual category used to classify income that is not classified as taxed under any other head of income.',
                }
            } else if (e.tdsSubSectionCategoryID == 5) {
              e.loadComponent = EmployeeIncomeFromOtherSourcesComponent,
                e.data = {
                  sectionName: e.categoryName,
                  sectionInfo:
                    'Income from other sources is a residual category used to classify income that is not classified as taxed under any other head of income.',
                }
            }
          });

          this.categorydata.push(
            {
              categoryName: 'Income Tax Computation',
              tdsSubSectionCategoryID: null,
              loadComponent: IncomeTaxComputationComponent,
              data: {
                sectionName: 'Income Tax Computation',
                sectionInfo: 'View complete breakup of payments, deductions and declarations. You can analyze how income tax is being calculated and what is the TDS every month.',

              }
            }
          )

          this.spinner.stop('company');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );

  }

  private loadComponent(tab: string, data: any, selectedFiscalYear: string, tdsSubSectionCategoryID: any) {

    this.componentContainer.clear();
    const selectedTab = this.categorydata.find(t => t.categoryName === tab);
    if (selectedTab) {
      const { loadComponent } = selectedTab;
      const componentRef = this.componentContainer.createComponent(loadComponent);
      (componentRef.instance as any).data = data;
      (componentRef.instance as any).selectedFiscalYear = selectedFiscalYear;
      (componentRef.instance as any).tdsSubSectionCategoryID = tdsSubSectionCategoryID;
      this.selectedTabLabel = { heading: tab, data, tdsSubSectionCategoryID: tdsSubSectionCategoryID };
    }
  }

  private selectFiscalYear(year: string) {
    this.selectedFiscalYear = year;

    if (this.selectedTabLabel && this.selectedTabLabel.heading != 'My Declarations') {
      this.loadComponent(this.selectedTabLabel.heading, this.selectedTabLabel.data, year, this.selectedTabLabel.tdsSubSectionCategoryID);
    } else {
      this.employeeDeclarationComponent.fiscalYear = year;
      this.employeeDeclarationComponent.ngOnInit();
    }
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }


  onTabSelect() {
    this.selectedTabLabel = {
      heading: this.myDeclarationData.sectionName, data: {}, tdsSubSectionCategoryID: null
    }
    this.componentContainer.clear();
    this.selectFiscalYear(this.selectedFiscalYear)
  }
}


