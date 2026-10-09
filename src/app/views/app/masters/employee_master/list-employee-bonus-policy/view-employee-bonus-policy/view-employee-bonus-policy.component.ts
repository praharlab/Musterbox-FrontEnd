import { Component, ViewChild, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-view-employee-bonus-policy',
    templateUrl: './view-employee-bonus-policy.component.html',
    styleUrls: ['./view-employee-bonus-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ViewEmployeeBonusPolicyComponent implements OnInit {
  bonusPolicyId: any

  @Input()
  set getbonusPolicyId(getbonusPolicyId: any) {
    this.bonusPolicyId = getbonusPolicyId;
  }

  @Input('getBonusPolicyId') getBonusPolicyId: any

  @ViewChild('addbonuspolicy') addbonuspolicy: NgForm;

  allcomp: any;
  adminRoot = environment.adminRoot;
  formValue: any;
  bonuspolicydata: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
  ) { }

  ngOnInit(): void {
    if (this.bonusPolicyId) {
      this.getcompany();
      this.editdata();
    }

  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allcomp = res.data;

          this.spinner.stop('company');
        }
      });
  }


  editdata() {
    this.spinner.start('getData');
    this.api
      .callApi(this.constant.GETBONUSPOLICYBYID + this.bonusPolicyId, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.bonuspolicydata = res.data;
          this.spinner.stop('getData');
        },
        (err) => {
          this.spinner.stop('getData');
          console.log('error', err);
        },
      );
  }


}
