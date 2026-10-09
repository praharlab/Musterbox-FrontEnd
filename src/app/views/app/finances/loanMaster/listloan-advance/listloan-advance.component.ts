import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-listloan-advance',
    templateUrl: './listloan-advance.component.html',
    styleUrls: ['./listloan-advance.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListloanAdvanceComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  scrollBarHorizontal = window.innerWidth < 1201;
  temp = [];
  page = {
    totalCount: 0,
    offset: 0,
  };
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  LoanId: any;
  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,

  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();


    this.LoanId = this.formValue.ListLoanMasterComponent.id;
    this.spinner.start('data');
    this.api
      .callApi(
        this.constant.LoanAdvanceBYID + '/' + this.formValue.ListLoanMasterComponent.id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop('data');
        }else{
          this.spinner.stop('data');

        }
      },(err) => {
        this.spinner.stop('data');

      });
  }

  Backbtn() {

    this.formValueStorageService.navigate(
      'ListLoanMasterComponent',
      this.formValue.ListLoanMasterComponent.body,
      '/finances/add_loanAdvance',
      this.LoanId,
    );

  }


}
