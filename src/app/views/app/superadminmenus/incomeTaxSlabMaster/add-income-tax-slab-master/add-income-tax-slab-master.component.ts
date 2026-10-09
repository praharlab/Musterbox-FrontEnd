import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-add-income-tax-slab-master',
    templateUrl: './add-income-tax-slab-master.component.html',
    styleUrls: ['./add-income-tax-slab-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddIncomeTaxSlabMasterComponent implements OnInit {
  @ViewChild('addform') addform: NgForm
  genderArray: string[];
  regimeArray: string[];
  fyarray: string[];
  adminRoot = environment.adminRoot;
  usertype: any;
  permissioncreate: number[];
  ipAddress: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.usertype = localStorage.getItem('usertype')
    if (this.usertype == 2) {
      this.permissioncreate = [1];
    }

    this.genderArray = ['Male', 'Female']
    this.regimeArray = ['New Regime', 'Old Regime']
    this.getFinancialYears();
    this.getIPAddress()
  }


  getFinancialYears() {

    this.spinner.start('financialyear');
    this.api.callApi(this.constant.GETFINANCIALYEARS, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.fyarray = res.data
        }
        this.spinner.stop('financialyear');
      },
      (err) => {

        this.spinner.stop('financialyear');
      },
    );

  }


  onSubmit() {
    if (!this.addform.valid) {
      return;
    }
    let body = {
      assessmentYear: this.addform.value.assessmentYear,
      gender: this.addform.value.gender,
      regime: this.addform.value.regime,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.ADDINCOMETAXSLABMASTER, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/list_incomeTaxSlabMaster']);
            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

}
