import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-add-user-ip',
    templateUrl: './add-user-ip.component.html',
    styleUrls: ['./add-user-ip.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddUserIpComponent implements OnInit {
  @ViewChild('addtask') addtask: NgForm;
  @ViewChild('accept') accept: NgForm;

  images: any = [];
  values: any = [];
  file: any = [];
  taskName: any;
  company_id: any;
  empList: any;
  taskdata: any;
  taskdata1: any;
  fileToUpload: any;
  imageUrl: any;
  taskSummary: any;
  taskStatus: any;
  selected1: any = [];
  alluser: any;
  selected: any = [];
  ipAddress: any;
  rowshow: any;
  priority: any;
  taskauth: any;
  getStatus: any;
  date: any;
  url: any;
  datashow: any;
  leaveshow: any;
  day: any;
  format: any;
  allcomp: any;
  usertype: any;
  childcompany: any;
  finalholidaypolicy: string;
  ownerList: any;
  finalbranch: string;
  allbranch: any[];
  adminRoot = environment.adminRoot;
  ips: string[] = [''];
  
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.values.push({
      ips: '',
    });
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.childcompany = localStorage.getItem('childcompany');
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.getallemployee();
    this.getUrl();
    this.getAllStatus();
    this.getIPAddress();
  }

  getcompany() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allcomp = res.data;
            this.spinner.stop();
          }
        });
    } else {
      const body = {
        companyMasterID: this.company_id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allcomp = res.data;

            this.spinner.stop();
          }
        });
    }
  }

  selectcompany(event) {
    this.finalbranch = '';
    this.selected = [];
    this.finalholidaypolicy = '';
    this.allbranch = [];
    this.ownerList = [];

    if (event) {
      this.company_id = event;
      const filterData = {
        companyMasterID: event,
      };
      this.spinner.start('users');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.selectAllForDropdownItems(this.ownerList);
            // this.ownerList.map(el => {
            //   el.name = el.firstName + " " + el.lastName + " (" + el.userNumber + ")"
            // })
            this.spinner.stop('users');
          }
        });

      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + event, {}, 'GET', true, false, true)
        .subscribe((res: any) => {

          this.allbranch = res;
          this.spinner.stop('branch');
        });
    }
  }

  selectbranch(event) {
    this.selected = [];
    this.finalholidaypolicy = '';

    if (event) {
      const filterData = {
        companyMasterID: this.company_id,
        branchMasterID: event,
      };
      this.spinner.start('users');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.selectAllForDropdownItems(this.ownerList);
            // this.ownerList.map((el) => {
            //   el.name =
            //     el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')'
            // })
            this.spinner.stop('users');
          }
        });
    } else {
      const filterData = {
        companyMasterID: this.company_id,
      };
      this.spinner.start('userss');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.selectAllForDropdownItems(this.ownerList);
            // this.ownerList.map(el => {
            //   el.name = el.firstName + " " + el.lastName + " (" + el.userNumber + ")"
            // })
            this.spinner.stop('userss');
          }
        });
    }
  }

  getAllStatus() {
    let body = {
      page: '',
      limit: '',
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('getallstages');
    this.api
      .callApi(this.constant.GETALLTASKSTAGES, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.getStatus = res.data;

          this.spinner.stop('getallstages');
        }
      });
  }

  newIp: string = ''; // New IP input
  ipsList: string[] = []; // List of added IPs


  // onSubmit() {
  //   if (!this.addtask.valid) {
  //     return;
  //   }
  
  //   const userMasterID = this.addtask.value.userMasterID; // Ensure this is an array
  //   const ips = Array.isArray(this.addtask.value.ips) ? this.addtask.value.ips : [this.addtask.value.ips]; // Ensure ips is an array
  
  //   const body = {
  //     userMasterID,
  //     ips,
  //     createBy: localStorage.getItem('id'),
  //     createByIp: this.ipAddress
  //   };
    
  
  //   this.spinner.start('add');
  //   this.api.callApi(this.constant.ADDUSERIP, body, 'POST', true, false, true)
  //     .subscribe((res: any) => {
  //       if (res.status === 200) {
  //         this.notifications.create('Done', res.message, NotificationType.Bare, {
  //           theClass: 'outline primary',
  //           timeOut: 3000,
  //           showProgressBar: true,
  //         });
  //         setTimeout(() => {
  //           this.router.navigate([this.adminRoot + '/masters/userIp']);
  //           this.spinner.stop('add');
  //         }, 3000);
  //       } else {
  //         this.notifications.create('Error', res.message, NotificationType.Bare, {
  //           theClass: 'outline primary',
  //           timeOut: 3000,
  //           showProgressBar: false,
  //         });
  //         this.spinner.stop('add');
  //       }
  //     });
  // }
  

  addIp() {
    this.values.push({
      ips: '',
    });
  }

  // addIp() {
  //   if (this.newIp && !this.ipsList.includes(this.newIp)) {
    
      
  //     this.ipsList.push(this.newIp);
  //     this.newIp = ''; // Clear the input field after adding
  //   }
  // }
  
  removeIp(ip: string) {
    this.ipsList = this.ipsList.filter(item => item !== ip);
  }

  onSubmit(form: NgForm) {


    if (!form.valid) {
      return;
    }

    const company =this.company_id;
    const branch = form.value.branch;
    const userMasterID = form.value.userMasterID; // Ensure this is an array
    const ips = this.values.map(value => value.ips);
    const body = {
      company,
      branch,
      userMasterID,
      ips,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress
    };

    // Start spinner
    this.spinner.start('add');

    // Make the API call
    this.api.callApi(this.constant.ADDUSERIP, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status === 200) {
            // Success handling
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/masters/userIp']);
              this.spinner.stop('add');
            }, 3000);
          } else {
            // Error handling
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('add');
          }
        },
        (err) => {
          // Handle errors if the API call fails
          this.notifications.create('Error', 'An error occurred while processing your request.', NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('add');
        }
      );
  }

  

  

  changePriority(value: any) {
    this.priority;
  }

  changeDay(value: any) {
    this.day;
  }

  changeDate(value: any) {
    this.date;
  }


  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  getallemployee() {
    this.alluser = [];
    let bb1 = {
      page: '',
      limit: '',
      companyMasterID: this.company_id,
    };
    this.api
      .callApi(this.constant.GETALLUSERS, bb1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alluser = res.data;
          this.selectAllForDropdownItems(this.alluser);
          this.alluser.map((el) => {
            el.name = el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')';
          });
          // let data1=[];
          // this.alldepartment.forEach(async (rating) => {
          //   data1.push(rating.departmentId)
          // });
          // this.selected1=data1;
        }
      });
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);

    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(this.fileToUpload);
    this.getUrl();
  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        // reader.readAsDataURL(event.target.files[i]);
        this.file.push(event.target.files[i]);

        // reader.onload = (event:any) => {
        //   var reader = new FileReader();

        // }
        // reader.onload = (event) => {

        //       this.url = (<FileReader>event.target).result;
        //     }
        reader.readAsDataURL(event.target.files[i]);
      }
      this.file = this.file[0];
    }
  }

  // onFileChange(event) {
  //   if (event.target.files && event.target.files[0]) {
  //     var filesAmount = event.target.files.length;
  //     for (let i = 0; i < filesAmount; i++) {

  //       var reader = new FileReader();
  //       this.images.push(event.target.files[i]);

  //       reader.readAsDataURL(event.target.files[i]);
  //     }

  //   }
  // }

  // onFileChange(event) {
  //   if (event.target.files && event.target.files[0]) {
  //       var filesAmount = event.target.files.length;
  //       for (let i = 0; i < filesAmount; i++) {

  //               var reader = new FileReader();
  //               // reader.readAsDataURL(event.target.files[i]);
  //               this.images.push(event.target.files[i]);
  //               // reader.onload = (event:any) => {
  //               //   var reader = new FileReader();

  //               // }
  // // reader.onload = (event) => {

  // //       this.url = (<FileReader>event.target).result;
  // //     }
  //               reader.readAsDataURL(event.target.files[i]);
  //       }
  //   }
  // }

  onSelectFile(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    // if (ext.toLowerCase() == 'png' && ext.toLowerCase() == 'jpg' && ext.toLowerCase() == 'jpeg') {
    //   //this.toastr.error('Selected file format is not supported!!', 'Success!',{timeOut:3000});
    //   this.notifications.create(
    //     'Error',
    //     'Selected file format is not supported',
    //     NotificationType.Bare,
    //     {
    //       theClass: 'outline primary',
    //       timeOut: 3000,
    //       showProgressBar: false,
    //     },
    //   )
    // }
    // else{

    this.file = event.target.files && event.target.files[0];
    if (this.file) {
      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      if (this.file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (this.file.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
    }
    //}
  }

  changecoperson(id) { }

  getUrl() {
    return 'url(' + this.imageUrl + ')';
  }

  calltoshow(event) {
    if (event.target.value == '0') {
      this.datashow = true;
    } else {
      this.datashow = false;
    }
  }

  toShow(event) {
    if (event == 'Daily') {
      this.rowshow = 'Daily';
    } else if (event == 'Weekly') {
      this.rowshow = 'Weekly';
    } else if (!event) {
      this.rowshow = 'Daily';
    } else {
      this.rowshow = 'Monthly';
    }
  }

  addvalue() {
    this.values.push({ taskStage: '' });
  }
  removevalue(i) {
    this.values.splice(i, 1);
  }
}
