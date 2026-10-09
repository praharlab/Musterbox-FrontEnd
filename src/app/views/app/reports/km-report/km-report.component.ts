import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields } from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { CommonUtils } from 'src/app/utils/common.utils';
@Component({
    selector: 'app-km-report',
    templateUrl: './km-report.component.html',
    styleUrls: ['./km-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class KmReportComponent implements OnInit {
  apiURL = environment.apiUrl;
  itemsPerPage = 10;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: '',
    startdate: '',
    enddate: '',
    userMasterID: null,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  url: string | ArrayBuffer;
  imgshow1: boolean;
  kmsData: any = [];
  datesArray: any[]; 
  usercheck: any;
  datecheck: any;
  markers1: any;
  markers1_length: any;
  isData: boolean;
  lat: number;
  lng: number;
  dirs: Array<any> = [];
  address: any;
  time: any;
  battery: any;
  gps: any;
  wifi: any;
  location: any;
  mobile_name: any;
  public info: Array<any> = [];
  polyline: boolean = true;
  direction: boolean
  markers: any;
  directionInfoData: any;
  defaultVal: any = 'true';
  parameterselectedItem: any;
  parameterdate: any;
  currentPage: number;
  permissionview: any = [];
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear]
  showRequiredFields: any = [CommonRequiredFields.Company]

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) { }

  ngOnInit(): void {
    this.checkpermission();
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
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'KmsReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit(val?: any) {
    this.datesArray = CommonUtils.getDatesFromDateRange(
      new Date(val?.startdate),
      new Date(val?.enddate),
    );

    this.filterData.page = 1;
    this.filterData.companyMasterID = val?.company;
    this.filterData.startdate = val?.startdate;
    this.filterData.enddate = val?.enddate;
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;
    this.getTrackReportData();
  }

  getTrackReportData() {
    this.spinner.start();
    this.api
      .callApi(this.constant.Track_Report, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.kmsData = res.data;
          if (this.kmsData.length > 0) {
            this.showButtons.push(CommonFilterButtonFields.Excel)
          } else {
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
          }
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 100);
        } else {
          this.kmsData = [];
          this.commonNotificationService.handleError(res.message)
        }
      });
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.page;
      this.getTrackReportData();
    } else {
      console.log('error');
    }
  }

  getMarkerColorUrl(item: any) {

    if (!item) return '/assets/logos/location_icon.png';

    if (item == "punchin") return '/assets/logos/location_dark_green.png';
    else if (item == "punchout") return '/assets/logos/location_dark_grey.png';
    else if (item == "checkin") return '/assets/logos/location_light_green.png';
    else if (item == "checkout") return '/assets/logos/location_light_grey.png';
    else return '/assets/logos/location_icon.png';

  }

  showtracking(selectedItem: any, date: any) {
    this.dirs = [];
    this.parameterselectedItem = selectedItem;
    this.parameterdate = date;
    this.usercheck = selectedItem.userMasterID;
    this.datecheck = new Date(date);


    this.markers1 = null;
    this.info = [];
    this.dirs = [];
    this.address = null;
    this.time = '';

    this.battery = '';
    this.gps = '';
    this.wifi = '';
    this.location = '';
    this.mobile_name = '';

    const filterData = {
      userMasterID: this.usercheck,
      date: this.datecheck,
    };
    this.spinner.start('track');
    this.api
      .callApi(this.constant.GETUSERTRACKINGDATA1, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {

        if (res.status == 200) {
          this.markers = res.data;
          this.directionInfoData = res.data;


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
                renderOptions: { suppressMarkers: true },
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
                  renderOptions: { suppressMarkers: true },
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
                renderOptions: { suppressMarkers: true },
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
            this.gps = this.markers1[this.markers1_length - 1].Gps;
            this.wifi = this.markers1[this.markers1_length - 1].Wifi;
            this.location = this.markers1[0].Address;
            this.mobile_name = this.markers1[0].Mobile_name;
            this.lat = parseFloat(this.markers1[0].Lattitude);
            this.lng = parseFloat(this.markers1[0].Longitude);
          } else {
            this.isData = false;
          }


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
          this.spinner.stop('start');
        }
        this.spinner.stop('track');
      });
  }

  showpoly() {
    this.polyline = true;
    this.direction = false;
    this.showtracking(this.parameterselectedItem, this.parameterdate);
  }

  showdir() {
    this.polyline = false;
    this.direction = true;
    this.showtracking(this.parameterselectedItem, this.parameterdate);
  }

  clear() {
    this.kmsData = [];
    this.filterData = {
      page: 1,
      limit: 10,
      userMasterID: null,
      companyMasterID: '',
      startdate: '',
      enddate: '',
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
    this.ngOnInit();
  }

  download() {
    const filterData1 = {
      companyMasterID: this.filterData.companyMasterID,
      startdate: this.filterData.startdate,
      enddate: this.filterData.enddate,
      userMasterID: this.filterData.userMasterID,
      exportData: true
    };

    this.spinner.start('start');
    this.api
      .callApi(this.constant.Track_Report, filterData1, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          this.downloadFileService.handleFileDownload(res, "KM-Report.xlsx", 'text/xlsx');
          this.spinner.stop('start');

        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  init(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
