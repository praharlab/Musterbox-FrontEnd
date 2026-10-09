import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-daily-vehicle-usage-report',
    templateUrl: './daily-vehicle-usage-report.component.html',
    styleUrls: ['./daily-vehicle-usage-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DailyVehicleUsageReportComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('kilometercomp') kilometercomp: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal3') closeModal3: ElementRef;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]

  rows: any = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: +localStorage.getItem('company_id'),
    fromdate: '',
    todate: '',
    // company: '',
    userMasterID: null,
    branchMasterID: null
  };

  page = {
    totalCount: 0,
    offset: 0,
  };

  page2 = {
    totalCount: 0,
    offset: 0,
  };
  events: any;

  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  usertype: any;
  company_id: any;
  allbranch: any;
  company1: any;
  image: any;
  enddate: Date;
  export: any;
  employeedata: any;
  deptfilter: boolean = false;
  // employee: any;
  selected3: any[];
  selected4: any[];
  endingDate: any;
  endingTime: any;
  endkilometer: any;

  display = false;
  userModalLeftPosition: any;
  userModalTopPosition: any;
  eventUserMasterId: any;
  branchInput: string;
  userInput: string;
  fromDateInput: string;
  toDateInput: string;
  kilometer: any;
  tableKilometer: any;
  rows2: any = [];
  date: any;

  user: any;
  startDate: string;
  items: any = [];
  lat: any = 23.0367;
  lng: any = 72.5118;

  public dirs: Array<any> = [];
  public info: Array<any> = [];
  address: any;
  time: any;
  isData: boolean = false;
  name: any = 'Name';
  view: string = 'true';
  defaultVal: any = 'true';
  polyline: boolean = true;
  direction: boolean = false;

  battery: any;
  gps: any;
  wifi: any;
  location: any;
  mobile_name: any;
  show: boolean = false;
  markers: any = [];
  markers1: any = [];
  markers_length: number;
  total_kms: any;
  number: any;
  designation: any;
  Username: any;
  department: any;
  visit: any;
  expense: any;
  map: boolean = true;

  RADIANS: number = 180 / 3.14159265;
  // METRES_IN_MILE: number = 1609.34;
  KMS_IN_MILE: number = 1.609344;

  public renderOptions = {
    suppressMarkers: true,
  };
  imgshow1: boolean;
  visit123: any;
  onMapBody = {
    id: '',
    date: '',
  };
  displaymodal: boolean = false;
  startkilometerValue: any;
  endkilometerValue: any;
  ipAddress: any;
  vehicleUsageID: any;
  directionInfoData: any;
  userTrackingData: any;
  userTrackingData_length: any;
  markers1_length: any;
  showdataid: any;
  developerMode: any;
  alldepartment: any;
  alldesignation: any[];
  allDivision: any[];
  selectedDivision: null;
  selectedWorkingArea: null;
  selectedEmployees: any = [];
  employee: any = [];
  allWorkingArea: any[];
  selectedbranch: any;
  selecteddept: any;
  selecteddesig: any;
  users_Body = {
    companyMasterID: '',
    branchMasterID: null,
    departmentID: '',
    designationID: '',
    divisionId: '',
    workingAreaId: ''
  }
  allcomp: any;
  activeTab: string = 'timeline';
  rowid1: any;
  rowdate1: any;
  showloader: boolean = false;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterID: +localStorage.getItem('company_id'),
      fromdate: '',
      todate: '',
      // company: '',
      userMasterID: null,
      branchMasterID: null
    };

    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.usertype = localStorage.getItem('usertype');
    this.company_id = +localStorage.getItem('company_id');
    this.checkpermission();
    this.getIPAddress();
  }

  getVehicleUsageDataData() {
    this.filterData.companyMasterID = +this.company_id;

    this.spinner.start('pageload');
    this.api
      .callApi(this.constant.GETVEHICLEUSAGEBYCOMPANYID, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          if (this.rows.length > 0) {
            this.showButtons.push(CommonFilterButtonFields.Excel)
          } else {
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
          }
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;

          for (let i = 0; i < this.rows.length; i++) {



            // this.rows[i].branchName = this.rows[i].userMaster.employeeBranches[0].length > 0 ?this.rows[i].userMaster.employeeBranches[0].branchMaster.branchName:''
            if (this.rows[i].endingDateTime == null) {
              this.tableKilometer = 0;
            } else {
              this.rows[i].tableKilometer = Number(
                this.rows[i].endkilometer - this.rows[i].startkilometer,
              ).toFixed(2);
            }
          }

          this.spinner.stop('pageload');
        }
      });
  }

  showdata(data) {
    this.date = data.startingDateTime;
    this.showdataid = data.userMasterID;
    this.onMapData(data.userMasterID, this.date.slice(0, 10));
    this.rows2 = [];
    let body = {
      companyMasterID: '',
      userMasterID: [data.userMasterID],
      startDate: this.date.slice(0, 10),
      endDate: this.date.slice(0, 10),
      page: 1,
      limit: 10,
    };

    this.spinner.start('displaydata');
    this.api.callApi(this.constant.GETVISITREPORT, body, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.rows2 = res.data;
        this.page2.totalCount = res.totalcount;
        this.spinner.stop('displaydata');
      },
      (err) => {
        this.spinner.stop('displaydata');
      },
    );
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
              permissionval.formName == 'VehicleMeterDetails' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'VehicleMeterDetails' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'VehicleMeterDetails' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'VehicleMeterDetails' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit(val?: any) {
    this.filterData.companyMasterID = val.company;
    // this.filterData.branch = val.branch;
    this.filterData.fromdate = val.fromdate;
    this.filterData.todate = val.todate;
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;
    this.filterData.branchMasterID = val.branch && val.branch?.length > 0 ? val.branch : null;
    this.getVehicleUsageDataData()
  }

  onActivate(event) {
    if (event.type == 'click') {
      this.display = false;
    }
    if (event.cellIndex == 1) {
      this.display = !this.display;
      this.eventUserMasterId = event.row.userMasterID;
      this.userModalLeftPosition = event.event.pageX + 79 + 'px';
      this.userModalTopPosition = event.event.pageY - 223 + 'px';
    }
  }
  onChildEvent(data: boolean) {
    this.display = data;
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getVehicleUsageDataData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getVehicleUsageDataData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }


  // selectcompany(id) {
  //   if (id) {
  //     this.branchInput = '';
  //     this.userInput = '';
  //     this.fromDateInput = '';

  //     this.spinner.start();
  //     this.api
  //       .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
  //       .subscribe((res: any) => {
  //         this.allbranch = res;
  //         this.spinner.stop();
  //       });

  //     let bb = {
  //       page: '',
  //       limit: '',
  //       companyMasterID: id,
  //     };
  //     this.spinner.start();
  //     this.api
  //       .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
  //       .subscribe((res: any) => {
  //         if (res.status == 200) {
  //           this.employee = res.data;
  //           this.selectAllForDropdownItems(this.employee);
  //           let data1 = [];
  //           this.employee.forEach(async (rating) => {
  //             data1.push(rating.userMasterID);
  //           });
  //           this.selected3 = data1;
  //           this.spinner.stop();
  //         }
  //       });
  //   } else {
  //     this.datefilter.resetForm();
  //     this.rows = [];
  //     this.allbranch = [];
  //     this.employeedata = [];
  //     this.selectAllForDropdownItems(this.employeedata);
  //   }
  // }

  // selectbranch(id) {
  //   this.deptfilter = true;
  //   let bb = {
  //     branchMasterID: id,
  //   };
  //   this.spinner.start();
  //   this.api
  //     .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
  //     .subscribe((res: any) => {
  //       if (res.status == 200) {
  //         this.employeedata = res.data;
  //         this.selectAllForDropdownItems(this.employeedata);
  //         let data2 = [];
  //         this.employeedata.forEach(async (rating) => {
  //           data2.push(rating.userMasterID);
  //         });
  //         this.selected4 = data2;
  //         this.spinner.stop();
  //       }
  //     });
  // }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  editimage(image) {
    this.image = image;
  }
  selectfrom() {
    this.enddate = new Date();
  }

  clear() {
    this.rows = [];
    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterID: +localStorage.getItem('company_id'),
      fromdate: '',
      todate: '',
      userMasterID: null,
      branchMasterID: null
    };
    this.page.totalCount = 0;
  }

  padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  formatDate(date) {
    return (
      [
        this.padTo2Digits(date.getDate()),
        this.padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  getMarkerColorUrl(item: any) {

    if (!item) return '/assets/logos/location_icon.png';

    if (item == "punchin") return '/assets/logos/location_dark_green.png';
    else if (item == "punchout") return '/assets/logos/location_dark_grey.png';
    else if (item == "checkin") return '/assets/logos/location_light_green.png';
    else if (item == "checkout") return '/assets/logos/location_light_grey.png';
    else return '/assets/logos/location_icon.png';

  }
  selectTab(tab: string) {
    this.activeTab = tab;
    // Additional handling if needed
    if (tab === 'timeline') {
      this.onMapData(this.rowid1, this.rowdate1);
    } else {
      this.onSubmit2(this.rowid1, this.rowdate1);
    }
  }

  onMapData(rowid, rowdate) {
    this.rowid1 = rowid,
      this.rowdate1 = rowdate
    this.showloader = true;

    this.total_kms = 0;
    this.displaymodal = false;
    this.markers1 = null;
    this.info = [];
    this.dirs = [];
    this.markers_length = null;
    this.address = null;
    this.time = '';

    this.battery = '';
    this.gps = '';
    this.wifi = '';
    this.location = '';
    this.mobile_name = '';
    this.developerMode = '';


    const filterData = {
      userMasterID: rowid,
      date: rowdate,
    };
    const filterData1 = {
      userMasterID: rowid,
      date: rowdate,
    };

    this.spinner.start('displaydata');
    this.api
      .callApi(this.constant.GETUSERTRACKINGDATA1, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {

        if (res.status == 200) {
          this.markers = res.data;
          this.directionInfoData = res.data;
          this.expense = this.markers.totalExpense;
          this.visit123 = this.markers.totalVisit;
          this.total_kms = this.markers.trackingKM;
          //Address List -ALL POINTS
          this.info = res.data.trackingPoints;

          //Marker List -Tracking POINTS > 85Mtrs.
          this.markers1 = res.data.tracking;


          if (this.markers1 && this.markers1.length && this.markers1.length > 0) {
            this.isData = true;
            this.markers1_length = this.markers1.length;

            if (this.markers1.length == 1) {
              this.dirs.push({
                origin: {
                  lat: parseFloat(this.markers1[0].Lattitude),
                  lng: parseFloat(this.markers1[0].Longitude),
                },
                // renderOptions: { suppressMarkers: true },
                renderOptions: {
                  suppressMarkers: true,
                  photo: res.data.photo,
                  tracking: res.data.tracking,
                  user: res.data.user,
                },
                markerOptions: { icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' },
                markerColor: {
                  url: this.getMarkerColorUrl(this.markers1[0].type),
                  scaledSize: {
                    width: 40,
                    height: 40
                  }
                }
              });

            } else {
              for (var i = 0; i < this.markers1_length - 1; i++) {
                this.dirs.push({
                  origin: {
                    lat: parseFloat(this.markers1[i].Lattitude),
                    lng: parseFloat(this.markers1[i].Longitude),
                  },
                  destination: {
                    lat: parseFloat(this.markers1[i + 1].Lattitude),
                    lng: parseFloat(this.markers1[i + 1].Longitude),
                  },
                  // renderOptions: { suppressMarkers: true },
                  renderOptions: {
                    suppressMarkers: true,
                    photo: res.data.photo,
                    tracking: res.data.tracking,
                    user: res.data.user,
                  },
                  markerOptions: { icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' },
                  markerColor: {
                    url: this.getMarkerColorUrl(this.markers1[i].type),
                    scaledSize: {
                      width: 40,
                      height: 40
                    }
                  }
                });

              }
              this.dirs.push({
                origin: {
                  lat: parseFloat(this.markers1[this.markers1_length - 1].Lattitude),
                  lng: parseFloat(this.markers1[this.markers1_length - 1].Longitude),
                },
                // renderOptions: { suppressMarkers: true },
                renderOptions: {
                  suppressMarkers: true,
                  photo: res.data.photo,
                  tracking: res.data.tracking,
                  user: res.data.user,
                },
                markerOptions: { icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' },
                markerColor: {
                  url: this.getMarkerColorUrl(this.markers1[this.markers1_length - 1]),
                  scaledSize: {
                    width: 40,
                    height: 40
                  }
                }
              });
            }

            this.address = this.markers1[0].Address;
            this.time = this.markers1[0].Track_datetime;

            this.battery = this.markers1[this.markers1_length - 1].Battery;
            this.developerMode = this.markers1[this.markers1_length - 1].developerMode;
            this.gps = this.markers1[this.markers1_length - 1].Gps;
            this.wifi = this.markers1[this.markers1_length - 1].Wifi;
            this.location = this.markers1[0].Address;
            this.mobile_name = this.markers1[0].Mobile_name;
            this.lat = parseFloat(this.markers1[0].Lattitude);
            this.lng = parseFloat(this.markers1[0].Longitude);

          } else {
            this.isData = false;
          }

          // for (var k = 0; k < this.directionInfoData.tracking.length; k++) {
          //   this.info.push({
          //     address:
          //       this.directionInfoData.tracking[k].Address != 'not found'
          //         ? this.directionInfoData.tracking[k].Address
          //         : 'not found',
          //     time: this.directionInfoData.tracking[k].Track_datetime,
          //     type: this.directionInfoData.tracking[k].type,
          //     battery: this.directionInfoData.tracking[k].Battery,
          //     gps: this.directionInfoData.tracking[k].Gps,
          //     wifi: this.directionInfoData.tracking[k].Wifi,
          //     mobile_name: this.directionInfoData.tracking[k].Mobile_name,
          //   });
          // }


          if (this.markers.photo != '' && this.markers.photo != null) {
            var img = new Image();
            img.src = this.apiURL + 'uploads/user/photo/' + this.markers.photo;

            if (img.complete) {
              this.imgshow1 = true;
            } else {
              img.onload = () => {
                this.imgshow1 = true;
              };

              img.onerror = () => {
                this.imgshow1 = false;
              };
            }
          } else {
            this.imgshow1 = false;
          }
          this.displaymodal = true;
        }
        this.showloader = false;

        this.spinner.stop('displaydata');
      });

    // this.spinner.start('displaydata');
    // this.api
    //   .callApi(this.constant.GETUSERTRACKINGDATA, filterData1, 'POST', true, false, true)
    //   .subscribe((res: any) => {
    //     if (res.status == 200) {
    //       this.userTrackingData = res.data;
    //       this.userTrackingData_length = this.userTrackingData.length;

    //       if (this.userTrackingData_length > 0) {
    //         this.total_kms = 0;
    //         function toRad(Value) {
    //           return (Value * Math.PI) / 180;
    //         }
    //         function calcCrow(lat1, lon1, lat2, lon2) {
    //           var R = 6371; // km
    //           var dLat = toRad(lat2 - lat1);
    //           var dLon = toRad(lon2 - lon1);
    //           lat1 = toRad(lat1);
    //           lat2 = toRad(lat2);

    //           var a =
    //             Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //             Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    //           var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //           var d = R * c;
    //           return d;
    //         }

    //         for (var i = 0; i < this.userTrackingData_length - 1; i++) {
    //           var lat1 = parseFloat(this.userTrackingData[i].Lattitude);
    //           var lat2 = parseFloat(this.userTrackingData[i + 1].Lattitude);
    //           var lon1 = parseFloat(this.userTrackingData[i].Longitude);
    //           var lon2 = parseFloat(this.userTrackingData[i + 1].Longitude);

    //           let kms = Number(calcCrow(lat1, lon1, lat2, lon2))
    //             ? Number(calcCrow(lat1, lon1, lat2, lon2))
    //             : 0;
    //           // if (this.total_kms != undefined) {
    //           //   this.total_kms = this.total_kms + kms;
    //           // } else {
    //           //   this.total_kms = kms;
    //           // }
    //           if (kms < 0.085) {
    //             this.userTrackingData[i + 1] = this.userTrackingData[i];
    //           }
    //         }
    //       }

    //       let tracking = this.userTrackingData.filter((obj, index, self) => {
    //         return index === self.findIndex((item) => item.UserTrackingID === obj.UserTrackingID);
    //       });

    //       this.markers1 = tracking;
    //       this.markers1_length = this.markers1.length;

    //       if (this.markers1_length > 0) {
    //         function toRad(Value) {
    //           return (Value * Math.PI) / 180;
    //         }
    //         function calcCrow(lat1, lon1, lat2, lon2) {
    //           var R = 6371; // km
    //           var dLat = toRad(lat2 - lat1);
    //           var dLon = toRad(lon2 - lon1);
    //           lat1 = toRad(lat1);
    //           lat2 = toRad(lat2);

    //           var a =
    //             Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //             Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    //           var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //           var d = R * c;
    //           return d;
    //         }

    //         for (var i = 0; i < this.markers1_length - 1; i++) {
    //           var lat1 = parseFloat(this.markers1[i].Lattitude);
    //           var lat2 = parseFloat(this.markers1[i + 1].Lattitude);
    //           var lon1 = parseFloat(this.markers1[i].Longitude);
    //           var lon2 = parseFloat(this.markers1[i + 1].Longitude);

    //           let kms = Number(calcCrow(lat1, lon1, lat2, lon2))
    //             ? Number(calcCrow(lat1, lon1, lat2, lon2))
    //             : 0;
    //           if (this.total_kms != undefined) {
    //             this.total_kms = this.total_kms + kms;
    //           } else {
    //             this.total_kms = kms;
    //           }
    //         }
    //       }
    //       if (this.markers1_length > 0) {
    //         this.isData = true;
    //         this.lat = parseFloat(this.markers1[0].Lattitude);
    //         this.lng = parseFloat(this.markers1[0].Longitude);
    //         if (this.markers1_length == 1) {
    //           this.isData = true;
    //           this.dirs.push({
    //             origin: {
    //               lat: parseFloat(this.markers1[0].Lattitude),
    //               lng: parseFloat(this.markers1[0].Longitude),
    //             },
    //             renderOptions: { suppressMarkers: true },
    //             markerOptions: { icon: 'http://i.imgur.com/7teZKif.png' },
    //           });
    //         } else {
    //           for (var i = 0; i < this.markers1_length - 1; i++) {
    //             this.isData = true;
    //             if (
    //               this.markers1[i].Lattitude != 'not found' &&
    //               this.markers1[i].Longitude != 'not found' &&
    //               this.markers1[i + 1].Lattitude != 'not found' &&
    //               this.markers1[i + 1].Longitude != 'not found'
    //             ) {
    //               this.dirs.push({
    //                 origin: {
    //                   lat: parseFloat(this.markers1[i].Lattitude),
    //                   lng: parseFloat(this.markers1[i].Longitude),
    //                 },
    //                 destination: {
    //                   lat: parseFloat(this.markers1[i + 1].Lattitude),
    //                   lng: parseFloat(this.markers1[i + 1].Longitude),
    //                 },
    //                 renderOptions: { suppressMarkers: true },
    //                 markerOptions: { icon: 'http://i.imgur.com/7teZKif.png' },
    //               });
    //             }
    //           }
    //           this.dirs.push({
    //             origin: {
    //               lat: parseFloat(this.markers1[this.markers1_length - 1].Lattitude),
    //               lng: parseFloat(this.markers1[this.markers1_length - 1].Longitude),
    //             },
    //             renderOptions: { suppressMarkers: true },
    //             markerOptions: { icon: 'http://i.imgur.com/7teZKif.png' },
    //           });
    //         }
    //         this.address = this.markers1[0].Address;
    //         this.time = this.markers1[0].Track_datetime;

    //         // this.battery = this.markers1[0].Battery;
    //         this.battery = this.markers1[this.markers1_length - 1].Battery;
    //         this.gps = this.markers1[this.markers1_length - 1].Gps;
    //         this.wifi = this.markers1[this.markers1_length - 1].Wifi;
    //         this.location = this.markers1[0].Address;
    //         this.mobile_name = this.markers1[0].Mobile_name;

    //         this.show = true;
    //       } else {
    //         this.isData = false;
    //       }

    //       this.displaymodal = true;
    //       this.spinner.stop('displaydata');
    //     }
    //   });

    this.show = true;
  }
  onSubmit2(rowid, rowdate) {
    this.rowid1 = rowid,
      this.rowdate1 = rowdate

    const filterData = {
      userMasterID: rowid,
      date: rowdate,
    };
    this.spinner.start('start');
    this.api
      .callApi(this.constant.GETUSERTRACKINGINFO, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {

          this.info = res.data;
          if (this.info.length > 0) {
            this.address = this.info[0].address;
            this.time = this.info[0].time;
            this.battery = this.info[0].battery;
            this.gps = this.info[0].gps;
            this.developerMode = this.info[0].developerMode;
            this.wifi = this.info[0].wifi;
            this.location = this.info[0].address;
            this.mobile_name = this.info[0].mobile_name;
          }
          this.spinner.stop('start');

        } else {
          this.handleError(res.message);

          this.spinner.stop('start');
        }
      }, (err) => {
        this.handleError(err.error.message);

        this.spinner.stop('start');
      },
      );


  }


  showdataModal3(data) {
    this.startkilometerValue = data.startkilometer;
    this.endkilometerValue = data.endkilometer;
    this.vehicleUsageID = data.vehicleUsageID;
  }

  onSubmit3() {
    if (!this.kilometercomp.valid) {
      return;
    }

    let totalkilometer =
      Number(this.kilometercomp.value.endkilometerform) - Number(this.startkilometerValue);

    if (totalkilometer < 0) {
      this.notifications.create('Error', 'Enter Right Ending Kilometer', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      return;
    }

    let body = {
      vehicleUsageID: this.vehicleUsageID,
      endingMeterImage: '',
      endkilometer: this.kilometercomp.value.endkilometerform,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };

    this.spinner.start('main');
    this.api.callApi(this.constant.ADDENDINGVEHICLEUSAGE, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.getVehicleUsageDataData();
            this.closeModal3.nativeElement.click();
            this.kilometercomp.resetForm();
            this.spinner.stop('main');
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('main');
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('main');
      },
    );
  }

  showpoly() {
    this.polyline = true;
    this.direction = false;
    this.onMapData(this.showdataid, this.date.slice(0, 10));
  }
  showdir() {
    this.polyline = false;
    this.direction = true;
    this.onMapData(this.showdataid, this.date.slice(0, 10));
  }

  closeonclick() {
    this.rows2 = [];
    this.markers1 = [];
    this.address = null;
    this.time = null;
    this.battery = null;
    this.gps = null;
    this.wifi = null;
    this.location = null;
    this.mobile_name = null;
    this.visit123 = null;
    this.expense = null;
    this.designation = null;
    this.department = null;
    this.total_kms = null;
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  download() {

    const getVehicleUsageDataBody = {
      companyMasterID: this.filterData.companyMasterID,
      fromdate: this.filterData.fromdate,
      todate: this.filterData.todate,
      userMasterID: this.filterData.userMasterID,
      Export: 'true',
      branchMasterID: this.filterData.branchMasterID

    };
    this.spinner.start('download');
    this.api
      .callApi(
        this.constant.GETVEHICLEUSAGEBYCOMPANYID,
        getVehicleUsageDataBody,
        'POST',
        true,
        false,
        true,
        true
      )
      .subscribe((res: any) => {
        if (res.type == 'application/json') {
          this.handleError('No data found to export!')
          this.spinner.stop('download');
        } else {

          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, `Daily Vehicle Usage Report.xlsx`);

          this.spinner.stop('download');
        }
      },
        (err) => {
          this.handleError(err.error.message || 'something went wrong!');
          this.spinner.stop('download');
        },);

  }

  loadComponent(tab: string) {
    this.activeTab = tab;
    if (tab === 'timeline') {
      this.onMapData(this.rowid1, this.rowdate1);
    } else {
      this.onSubmit2(this.rowid1, this.rowdate1);
    }
  }

  init(val: any) {
    // this.filterData.userMasterID = val.map((x) => x.userMasterID)
  }
  
  getCompany(id: any) {
    this.filterData.companyMasterID = id;
    this.getVehicleUsageDataData();
    this.company_id = id
  }

  emitUsers(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

}



