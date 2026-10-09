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


@Component({
    selector: 'app-add-income-tax-slab',
    templateUrl: './add-income-tax-slab.component.html',
    styleUrls: ['./add-income-tax-slab.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddIncomeTaxSlabComponent implements OnInit {

  @ViewChild('addform')addform:NgForm
  genderArray: string[];
  regimeArray: string[];
  fyarray: string[];
  adminRoot = environment.adminRoot;
  usertype: any;
  permissioncreate: number[];
  ipAddress: any;
  masterData: any;
  addForm: UntypedFormGroup;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    // private fb: FormBuilder
  ) {
    // this.addForm = this.fb.group({
    //   incomeTaxSlabMasterID: ['', [Validators.required]],
    //   fromAmount: ['', [Validators.required, Validators.min(0)]],
    //   toAmount: ['', [Validators.required, Validators.min(0)]],
    //   percentage:['',[Validators.required, Validators.min(0),Validators.max(100)]]
    // });
   }

  ngOnInit(): void {
    this.usertype = localStorage.getItem('usertype')
    if(this.usertype==2){
      this.permissioncreate = [1];
    }

    this.getIPAddress()
    this.getMasterData()
  }

 
  // get f() {
  //   return this.addForm.controls;
  // }

  
  getMasterData() {


    this.spinner.start('getdata');
    this.api.callApi(this.constant.GETALLDATAINCOMETAXSLABMASTER, {}, 'GET', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.masterData = res.data,
          
          this.spinner.stop('getdata');
        } else {
          this.spinner.stop('getdata');
        }


      },
      (err) => {
        console.log('error', err);
        this.spinner.stop('getdata');
      },
    );

  }

  onSubmit() {
    if (!this.addform.valid) {
      return;
    }
    let body = {
      incomeTaxSlabMasterID:this.addform.value.incomeTaxSlabMasterID,
      fromAmount:this.addform.value.fromAmount,
      toAmount:this.addform.value.toAmount,
      percentage:this.addform.value.percentage,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.ADDINCOMETAXSLAB, body, 'POST', true, true, true).subscribe(
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
          this.notifications.create('Error', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Error, {
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
