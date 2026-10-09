import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-form16-master',
    templateUrl: './form16-master.component.html',
    styleUrls: ['./form16-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Form16MasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  Form16Array: any = [];
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
  ) {}

  ngOnInit(): void {
    this.spinner.start('oninit');
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.formdata = res.master;
          this.visible = true;
          this.spinner.stop('oninit');
        }
      });

    this.Form16Array = [
      {
        icon: 'iconsminds-notepad',
        label: 'Employee Investment',
        menu: 'Investment',
        to: `${this.adminRoot}/form16s/employee_investment`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Tax Challan',
        menu: 'TaxChallan',
        to: `${this.adminRoot}/form16s/tax_challan`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Quater Tax Challan',
        menu: 'QuaterTaxChallan',
        to: `${this.adminRoot}/form16s/quater_tax_challan`,
      },

      {
        icon: 'iconsminds-notepad',
        label: 'TDS Slab',
        menu: 'TdsSlab',
        to: `${this.adminRoot}/form16s/tds_slab`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Form 16 Report',
        menu: 'TdsSlab',
        to: `${this.adminRoot}/form16s/form16report`,
      },
    ];
  }
}
