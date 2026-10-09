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
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-income-tax-slab',
    templateUrl: './edit-income-tax-slab.component.html',
    styleUrls: ['./edit-income-tax-slab.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditIncomeTaxSlabComponent implements OnInit {
  @ViewChild('editform') editform: NgForm;
  genderArray: string[];
  regimeArray: string[];
  fyarray: string[];
  adminRoot = environment.adminRoot;
  usertype: any;
  permissioncreate: number[];
  ipAddress: any;
  masterData: any;
  addForm: UntypedFormGroup;
  incomeTaxSlabData: any;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService, // private fb: FormBuilder
  ) {
    // this.addForm = this.fb.group({
    //   incomeTaxSlabMasterID: ['', [Validators.required]],
    //   fromAmount: ['', [Validators.required, Validators.min(0)]],
    //   toAmount: ['', [Validators.required, Validators.min(0)]],
    //   percentage:['',[Validators.required, Validators.min(0),Validators.max(100)]]
    // });
  }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.usertype = localStorage.getItem('usertype');
    if (this.usertype == 2) {
      this.permissioncreate = [1];
    }

    this.getIPAddress();
    this.getMasterData();
    this.getDataById();
  }

  // get f() {
  //   return this.addForm.controls;
  // }

  getMasterData() {
    this.spinner.start('getdata');
    this.api
      .callApi(this.constant.GETALLDATAINCOMETAXSLABMASTER, {}, 'GET', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            (this.masterData = res.data), this.spinner.stop('getdata');
          } else {
            this.spinner.stop('getdata');
            this.handleError(res.message);
          }
        },
        (err) => {
          this.spinner.stop('getdata');
          this.handleError(err.error.message);
        },
      );
  }

  getDataById() {
    // let id = this.formValue.ListIncomeTaxSlabComponent.id;
    this.spinner.start('data');
    this.api
      .callApi(
        this.constant.GETBYIDINCOMETAXSLAB + this.formValue.ListIncomeTaxSlabComponent.id,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.incomeTaxSlabData = res.data;
          this.spinner.stop('data');
        },
        (err) => {
          this.spinner.stop('data');
          this.handleError(err.error.message);
        },
      );
  }

  onSubmit() {
    if (!this.editform.valid) {
      return;
    }
    const body = {
      incomeTaxSlabMasterID: this.editform.value.incomeTaxSlabMasterID,
      fromAmount: this.editform.value.fromAmount,
      toAmount: this.editform.value.toAmount,
      percentage: this.editform.value.percentage,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api
      .callApi(
        this.constant.UPDATEINCOMETAXSLAB + this.formValue.ListIncomeTaxSlabComponent.id,
        body,
        'PUT',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });

            this.router.navigate([this.adminRoot + '/superadminmenus/list_incomeTaxSlab']);
            this.spinner.stop();
          } else {
            this.handleError(res.message);
            this.spinner.stop();
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop();
        },
      );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
