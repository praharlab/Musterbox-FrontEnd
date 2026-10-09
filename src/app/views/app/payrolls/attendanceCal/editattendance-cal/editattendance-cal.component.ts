import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-editattendance-cal',
    templateUrl: './editattendance-cal.component.html',
    styleUrls: ['./editattendance-cal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditattendanceCalComponent implements OnInit {
  @ViewChild('addattendance') addattendance: NgForm;

  ipAddress: any;
  yearMonth: any = [];
  employee: any = [];
  companydata: any = [];
  isdisebled: boolean = false;
  company_id: any;
  childcompany: any;
  company: any = [];
  leavetypedata: any = [];
  monthdays: any;
  monthworkdays: any;
  companyMasterId: any;
  userMasterId: any;
  AttnYearMM: any;
  companyName: any;
  userName: any;
  empJoindata: any;
  salarydata: any;
  ActCat: any;
  filterData = {
    userMasterID: '',
    month: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  rows: any = [];
  temp: any[];
  filter: string;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    public activatedRoute: ActivatedRoute,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.childcompany = localStorage.getItem('childcompany');
    this.company_id = localStorage.getItem('company_id');
    this.userMasterId = parseInt(this.activatedRoute.snapshot.params.id);

    this.companyMasterId = parseInt(this.activatedRoute.snapshot.params.cid);
    this.AttnYearMM =
      this.activatedRoute.snapshot.params.year.slice(0, 4) +
      this.activatedRoute.snapshot.params.year.slice(4);
    this.yearMonth =
      String(this.AttnYearMM).slice(0, 4) + '-' + String(this.AttnYearMM).slice(4, 6);

    this.getIPAddress();
    this.getcompany();
    this.getCompanyUser();
    this.getLeavetype();
    // this.getEmpBasic()
  }

  getLeavetype() {
    // if(this.addattendance.value.AttnYearMon != '' && this.addattendance.value.userMasterID != ''){
    this.filterData.userMasterID = this.userMasterId;
    this.filterData.month = this.AttnYearMM;
    this.api
      .callApi(
        this.constant.GETATTENDANCEBALANCEBYUSERID,
        this.filterData,
        'POST',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.filter = 'filter';
          this.leavetypedata = res.data;

          // this.page.totalCount = res.totalcount
          // this.resultColumns=[]
          // for(var key in this.rows[0]){
          //       this.resultColumns.push({
          //         name: key,
          //         prop:key,
          //         flexGrow: 1.2,
          //         minWidth: 200
          //     });
          //   };
          this.spinner.stop();
        }
      });
  }

  getCompanyUser() {
    let bb = {
      page: '',
      limit: '',
      companyMasterID: this.companyMasterId,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          let udata = this.employee.filter((c1) => c1.userMasterID == this.userMasterId);
          this.userName = udata[0].displayName;
          this.spinner.stop();
        }
      });
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          let cdata = this.company.filter((c1) => c1.companyMasterID == this.companyMasterId);
          this.companyName = cdata[0].companyName;
          this.spinner.stop();
        }
      });
  }

  // onSubmit(){
  //   if(!this.addattendance.valid){
  //     return
  //   }

  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You want to verify this?',
  //     icon: 'error',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, verify it!',
  //     cancelButtonText: 'No, keep it',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       var body=[];
  //       this.leavetypedata.forEach(element => {
  //           body.push({
  //             "userMasterID":element.usermasterid,
  //             "LeaveTranId":element.leavetranid,
  //             "AttnYearMon":element.attnyearmon,
  //             "MonDays":this.monthdays,
  //             "MonWorkDays":element.monworkdays,
  //             "AttnVal":element.attnval,
  //             "createBy":localStorage.getItem('id'),
  //             "createByIp":this.ipAddress
  //           })
  //       });
  //       this.spinner.start();
  //       this.isdisebled=true;
  //       this.api.callApi(
  //         this.constant.UPDATELEAVETRANS,
  //         body,
  //         "POST",
  //         true,
  //         false,
  //         true
  //       ).subscribe((res: any) => {
  //         if (res.status == 200) {

  //           this.notifications.create('Done', res.message,
  //           NotificationType.Bare, { theClass: 'outline primary', timeOut: 3000, showProgressBar: true });
  //             // this.ngOnInit();
  //             setTimeout(() => {
  //               this.router.navigate(['app/attendancecal'])
  //               this.spinner.stop();
  //               this.isdisebled=false;
  //             }, 3000)
  //             }
  //             else
  //             {
  //               this.notifications.create('Error', res.message, NotificationType.Bare,
  //               { theClass: 'outline primary', timeOut: 3000, showProgressBar: false });
  //               this.spinner.stop();
  //               this.isdisebled=false;
  //             }
  //           }, err => {
  //             this.notifications.create('Error', err , NotificationType.Bare,
  //               { theClass: 'outline primary', timeOut: 3000, showProgressBar: false });
  //               this.spinner.stop();
  //               this.isdisebled=false;
  //           })
  //         }

  //   })

  // }

  changeAttnVal() {
    let daysum = 0;

    // let result = this.leavetypedata.filter((s) => s.Eff_Total == 1);
    let result = this.leavetypedata

    let total = result.map((item) => item.AttnVal).reduce((prev, next) => prev + next);

    let absentsoft = 0;

    // if(this.leavetypedata[0].salaryCalculationAct=='S')
    // {
    absentsoft = this.leavetypedata[0].MonDays - total;
    if (absentsoft < 0) {
      this.notifications.create(
        'Error',
        'Monthdays And Attndance Value Not Match!!',
        NotificationType.Error,
        { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
      );
      this.spinner.stop();
      this.isdisebled = true;
    } else {
      this.isdisebled = false;
    }
    // }
    // else
    // {
    //    absentsoft=this.leavetypedata[0].MonWorkDays-total
    //    if(absentsoft<0){
    //     this.notifications.create('Error',"Monthdays And Attndance Value Not Match!!", NotificationType.Error,
    //             { theClass: 'outline primary', timeOut: 3000, showProgressBar: false });
    //             this.spinner.stop();
    //             this.isdisebled=true;
    //   }else{
    //     this.isdisebled=false;
    //   }
    // }

    this.leavetypedata.forEach((element) => {
      // if (element.Eff_Total == -1) {
      //   element.AttnVal = absentsoft;
      // }
      // daysum = daysum + element.AttnVal;
    });
  }

  alertConfirmation() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to verify?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, verify it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        var body = [];
        this.leavetypedata.forEach((element) => {
          body.push({
            userMasterID: element.userMasterID,
            LeaveTranId: element.LeaveTranId,
            AttnYearMon: element.AttnYearMon,
            MonDays: element.MonDays,
            MonWorkDays: element.MonWorkDays,
            AttnVal: element.AttnVal,
            createBy: localStorage.getItem('id'),
            createByIp: this.ipAddress,
          });
        });

        this.spinner.start();
        this.isdisebled = true;
        this.api.callApi(this.constant.UPDATELEAVETRANS, body, 'POST', true, false, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              // this.ngOnInit();
              setTimeout(() => {
                this.router.navigate([this.adminRoot + '/payrolls/attendancecal']);
                this.spinner.stop();
                this.isdisebled = false;
              }, 3000);
            } else {
              this.notifications.create('Error', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop();
              this.isdisebled = false;
            }
          },
          (err) => {
            this.notifications.create('Error', err, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
            this.isdisebled = false;
          },
        );
      }
    });
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
