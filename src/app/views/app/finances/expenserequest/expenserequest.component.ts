import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgForm } from '@angular/forms';
import { ModalService } from 'src/app/services/modal.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { TravelData, TravelMarker, TravelMarkerOptions } from 'travel-marker';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { expenseTypeArrayForDropDown, expenseTypes } from 'src/app/constants/commonVariables';
import { ViewExpenseCommonComponent } from '../view-expense-common/view-expense-common.component';
import { ExpReqTableComponent } from './exp-req-table/exp-req-table.component';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
    selector: 'app-expenserequest',
    templateUrl: './expenserequest.component.html',
    styleUrls: ['./expenserequest.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ExpenserequestComponent implements OnInit {
  @ViewChild('filterdate') filterdate: NgForm;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild(ExpReqTableComponent) expReqTableComponent: ExpReqTableComponent;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;
  @ViewChild('filterdata') filterdata: NgForm;
  @ViewChild('closeModal6') closeModal6: ElementRef;
  expenseTypeArrayForDropDownData: any = expenseTypeArrayForDropDown;

  @ViewChild(ViewExpenseCommonComponent)
  viewExpenseCommonComponent: ViewExpenseCommonComponent;
  // @ViewChild(ExpenseAcceptRejectModalComponent)
  // expenseAcceptRejectModalComponent: ExpenseAcceptRejectModalComponent;

  actionType: string = '';

  showFinanceData: boolean = false;

  row: any;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  columns = [];

  ColumnMode = ColumnMode;
  itemsPerPage = 10;
  itemOptionsPerPage = [...ItemOptionsPerPageArray, 500, 1000];

  selected = [];

  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 20,
    authorizerUserMasterID: +localStorage.getItem('id'),
    userid: [],
    fromdate: '',
    todate: '',
    fromamount: '',
    toamount: '',
    product: [],
    expenseType: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  referencedata: any;
  userdata: any = [];
  department: any;
  mainexpensename: any[];
  markers: any;
  visit: any;
  expense: any;
  designation: any;
  lat: any;
  lng: any;
  polyline: boolean = true;
  dirs: Array<any> = [];
  markers1: any = [];
  markers1_length: any;
  address: any;
  time: any;
  battery: any;
  gps: any;
  wifi: any;
  location: any;
  mobile_name: any;
  info: any = [];
  direction: boolean = false;
  defaultVal: boolean = true;
  referencedata1: any = [];
  lat1: 23.0405878;
  lng1: 72.5122522;
  isData: boolean;
  total_kms: any;

  visitdata: any;
  visitcustomizefield: any;
  image: any;
  tourdata: any;
  visitreportcustomizefield: any;
  D1: string;
  comp: any;
  alldepartment: any;
  user: any;
  User: any;
  expensedata: any;
  mainproduct: any[];
  product: any;
  trackingdata: any;
  newArray2: any = [];
  newArray: any = [];

  coperson: any = [];
  visitdataForTracking: any;
  visitdate: any;
  enddate: Date;
  markers_length: null;
  directionInfoData: any;
  imgshow1: boolean;
  userTrackingData: any;
  userTrackingData_length: any;
  developerMode: any;
  activeTab: string = 'timeline';

  mapZoom: number = 15;
  wayPoints: any = [];
  tempArray: any = [];
  marker: TravelMarker | any;
  resetAnimation: boolean = false;
  isAnimation: boolean = false;
  speedMultiplier = 10;
  mapInstance: any;
  markerEventListener: any;
  line: any;
  directionsRenderer: any;
  directionsService: any;
  expenseTypesObj: any = expenseTypes;
  selectedTab: string = 'group';

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private modalService: ModalService,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.modalService.userRequestRefresh$.subscribe(() => {
      if (this.selectedTab == 'group') {
        this.getauthrequestdata();
      } else {
        this.expReqTableComponent.filter();
      }
    });
    this.checkpermission()
  }


  getauthrequestdata() {
    this.spinner.start('auth');
    this.api
      .callApi(
        this.constant.EXPENSEAUTH_DETAILS + localStorage.getItem('id'),
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          this.userdata = res.data;
          this.mainexpensename = [];
          for (let i = 0; i < this.userdata.length; i++) {
            this.userdata[i].fullname =
              this.userdata[i].userName +
              ' ( ' +
              this.userdata[i].Number +
              ' - ' +
              this.userdata[i].companyMaster.companyName +
              ' )';
            this.mainexpensename.push(this.userdata[i].userMasterID);
          }

          this.spinner.stop('auth');

          if (this.mainexpensename.length == 0)
            this.mainexpensename = [+localStorage.getItem('id')];
          this.filterData.userid = this.mainexpensename.map((d) => +d);

          this.getExpenseAuthByUser();
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);

          this.spinner.stop('auth');
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
              permissionval.formName == 'ExpenseRequest' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ExpenseRequest' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ExpenseRequest' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }


  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.getExpenseAuthByUser()
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.expReqTableComponent.filterData.limit = ev;

    if (this.selectedTab == 'group') {
      this.getExpenseAuthByUser()
    } else {
      this.expReqTableComponent.filter();
    }
  }

  getMarkerColorUrl(item: any) {
    if (!item) return '/assets/logos/location_icon.png';

    if (item == 'punchin') return '/assets/logos/location_dark_green.png';
    else if (item == 'punchout') return '/assets/logos/location_dark_grey.png';
    else if (item == 'checkin') return '/assets/logos/location_light_green.png';
    else if (item == 'checkout') return '/assets/logos/location_light_grey.png';
    else return '/assets/logos/location_icon.png';
  }
  showtracking(row) {
    this.dirs = [];
    this.total_kms = 0;
    this.referencedata1 = row;
    this.trackingdata = null;
    if (
      this.referencedata1?.visitID == '' ||
      this.referencedata1?.visitID == null
    ) {
      this.total_kms = 0;
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
        userMasterID: this.referencedata1?.userMasterID,
        date: this.referencedata1?.expense_date,
      };

      this.spinner.start('displaydata');
      this.api
        .callApi(this.constant.GETUSERTRACKINGDATA1, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.trackingdata = res.data;
            this.markers = res.data;
            this.directionInfoData = res.data;

            this.total_kms = res.data.trackingKM ? res.data.trackingKM : 0;

            //Address List -ALL POINTS
            this.info = res.data.trackingPoints;

            //Marker List -Tracking POINTS > 85Mtrs.
            this.markers1 = res.data.tracking;
            setTimeout(() => {
              this.polyline ? this.initRoute() : this.calcRoute();
            }, 2000);

            if (this.markers1 && this.markers1.length && this.markers1.length > 0) {
              this.lat = parseFloat(this.markers1[0].Lattitude);
              this.lng = parseFloat(this.markers1[0].Longitude);
              this.isData = true;
              this.markers1_length = this.markers1.length;
              const waypoints: any = [];

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
                      height: 40,
                    },
                  },
                });
              } else {
                for (var i = 0; i < this.markers1_length - 1; i++) {
                  this.dirs.push({
                    origin: {
                      lat: parseFloat(this.markers1[i].Lattitude),
                      lng: parseFloat(this.markers1[i].Longitude),
                    },
                    destination: {
                      lat: parseFloat(this.markers1[i + 1]?.Lattitude),
                      lng: parseFloat(this.markers1[i + 1]?.Longitude),
                    },
                    // renderOptions: { suppressMarkers: true },
                    renderOptions: {
                      suppressMarkers: true,
                      photo: res.data.photo,
                      tracking: res.data.tracking,
                      user: res.data.user,
                    },
                    markerOptions: {
                      icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    },
                    markerColor: {
                      url: this.getMarkerColorUrl(this.markers1[i].type),
                      scaledSize: {
                        width: 40,
                        height: 40,
                      },
                    },
                  });
                  const waypoint = {
                    lat: parseFloat(this.markers1[i]?.Lattitude),
                    lng: parseFloat(this.markers1[i]?.Longitude),
                  };
                  waypoints.push({ location: waypoint, stopover: true });
                }
                const destinationWaypoint = {
                  lat: parseFloat(this.markers1[this.markers1.length - 1]?.Lattitude),
                  lng: parseFloat(this.markers1[this.markers1.length - 1]?.Longitude),
                };
                waypoints.push({ location: destinationWaypoint, stopover: true });

                const groupedWaypoints: any = [];
                let currentGroup: any = [];

                for (let i = 0; i < waypoints.length; i++) {
                  currentGroup.push(waypoints[i]);

                  if (currentGroup.length === 24) {
                    // groupedWaypoints.push(currentGroup);
                    groupedWaypoints.push({
                      waypoint: currentGroup,
                      origin: currentGroup[0]?.location,
                      destination: currentGroup[currentGroup.length - 1]?.location,
                    });
                    currentGroup = [];
                  }
                }

                if (currentGroup.length > 0) {
                  groupedWaypoints.push({
                    waypoint: currentGroup,
                    origin: currentGroup[0]?.location,
                    destination: currentGroup[currentGroup.length - 1]?.location,
                  });
                }
                this.wayPoints = groupedWaypoints;
              }

              this.address = this.markers1[0].Address;
              this.time = this.markers1[0].Track_datetime;

              this.battery = this.markers1[this.markers1_length - 1].Battery;
              this.gps = this.markers1[this.markers1_length - 1].Gps;
              this.developerMode = this.markers1[this.markers1_length - 1].developerMode;
              this.wifi = this.markers1[this.markers1_length - 1].Wifi;
              this.location = this.markers1[0].Address;
              this.mobile_name = this.markers1[0].Mobile_name;
              this.lat = parseFloat(this.markers1[0].Lattitude);
              this.lng = parseFloat(this.markers1[0].Longitude);
            } else {
              this.isData = false;
            }

            this.visit = this.markers.totalVisit;

            this.expense = this.markers.totalExpense;
            this.designation = this.markers.designation;
            this.department = this.markers.department;

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
          this.spinner.stop('displaydata');
        });
    } else {
      this.api
        .callApi(
          this.constant.VIEWVISIT +
          this.referencedata1?.visitID,
          {},
          'GET',
          true,
          false,
          true,
        )
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.visitdataForTracking = res.data;
            this.visitdate = this.visitdataForTracking.visitDate.toString().slice(0, 10);

            const filterData = {
              userMasterID: this.referencedata1?.userMasterID,
              date: this.visitdate,
            };

            this.spinner.start('displaydata');
            this.api
              .callApi(this.constant.GETUSERTRACKINGDATA1, filterData, 'POST', true, false, true)
              .subscribe((res: any) => {
                if (res.status == 200) {
                  this.trackingdata = res.data;
                  this.markers = res.data;
                  this.directionInfoData = res.data;

                  this.total_kms = res.data.trackingKM ? res.data.trackingKM : 0;
                  this.info = res.data.trackingPoints;
                  this.markers1 = res.data.tracking;

                  setTimeout(() => {
                    this.polyline ? this.initRoute() : this.calcRoute();
                  }, 2000);

                  if (this.markers1 && this.markers1.length && this.markers1.length > 0) {
                    const waypoints: any = [];
                    this.lat = parseFloat(this.markers1[0].Lattitude);
                    this.lng = parseFloat(this.markers1[0].Longitude);
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
                        markerOptions: {
                          icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        },
                        markerColor: {
                          url: this.getMarkerColorUrl(this.markers1[0].type),
                          scaledSize: {
                            width: 40,
                            height: 40,
                          },
                        },
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
                          renderOptions: {
                            suppressMarkers: true,
                            photo: res.data.photo,
                            tracking: res.data.tracking,
                            user: res.data.user,
                          },
                          markerOptions: {
                            icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                          },
                          markerColor: {
                            url: this.getMarkerColorUrl(this.markers1[i].type),
                            scaledSize: {
                              width: 40,
                              height: 40,
                            },
                          },
                        });
                        const waypoint = {
                          lat: parseFloat(this.markers1[i]?.Lattitude),
                          lng: parseFloat(this.markers1[i]?.Longitude),
                        };
                        waypoints.push({ location: waypoint, stopover: true });
                      }
                      const destinationWaypoint = {
                        lat: parseFloat(this.markers1[this.markers1.length - 1]?.Lattitude),
                        lng: parseFloat(this.markers1[this.markers1.length - 1]?.Longitude),
                      };
                      waypoints.push({ location: destinationWaypoint, stopover: true });

                      const groupedWaypoints: any = [];
                      let currentGroup: any = [];

                      for (let i = 0; i < waypoints.length; i++) {
                        currentGroup.push(waypoints[i]);

                        if (currentGroup.length === 24) {
                          groupedWaypoints.push({
                            waypoint: currentGroup,
                            origin: currentGroup[0]?.location,
                            destination: currentGroup[currentGroup.length - 1]?.location,
                          });
                          currentGroup = [];
                        }
                      }

                      if (currentGroup.length > 0) {
                        groupedWaypoints.push({
                          waypoint: currentGroup,
                          origin: currentGroup[0]?.location,
                          destination: currentGroup[currentGroup.length - 1]?.location,
                        });
                      }
                      this.wayPoints = groupedWaypoints;
                      this.dirs.push({
                        origin: {
                          lat: parseFloat(this.markers1[this.markers1_length - 1].Lattitude),
                          lng: parseFloat(this.markers1[this.markers1_length - 1].Longitude),
                        },
                        renderOptions: {
                          suppressMarkers: true,
                          photo: res.data.photo,
                          tracking: res.data.tracking,
                          user: res.data.user,
                        },
                        markerOptions: {
                          icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        },
                        markerColor: {
                          url: this.getMarkerColorUrl(this.markers1[this.markers1_length - 1]),
                          scaledSize: {
                            width: 40,
                            height: 40,
                          },
                        },
                      });
                    }

                    this.address = this.markers1[0].Address;
                    this.time = this.markers1[0].Track_datetime;

                    this.battery = this.markers1[this.markers1_length - 1].Battery;
                    this.gps = this.markers1[this.markers1_length - 1].Gps;
                    this.wifi = this.markers1[this.markers1_length - 1].Wifi;
                    this.location = this.markers1[0].Address;
                    this.mobile_name = this.markers1[0].Mobile_name;
                    this.developerMode = this.markers1[this.markers1_length - 1].developerMode;
                  } else {
                    this.isData = false;
                  }
                  this.visit = this.markers.totalVisit;

                  this.expense = this.markers.totalExpense;
                  this.designation = this.markers.designation;
                  this.department = this.markers.department;

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
                this.spinner.stop('displaydata');
              });
            this.markers1.splice(0);
            this.info.splice(0);
            this.spinner.stop('showtracking');
          }
        });
    }
  }

  showpoly() {
    this.marker?.reset();
    this.marker?.pause();
    this.marker?.setMap(null);
    this.marker = null;
    this.directionsRenderer?.setMap(null);
    this.markerEventListener = null;
    this.tempArray = [];
    this.isAnimation = false;
    this.polyline = true;
    this.direction = false;
    this.line?.setMap(null);
    this.line = null;
    this.initRoute();
  }
  showdir() {
    this.marker?.pause();
    this.markerEventListener = null;
    this.tempArray.map((x) => {
      x.isPlayed = false;
    });
    this.tempArray = [];
    this.marker?.setMap(null);
    this.marker = null;
    this.line?.setMap(null);
    this.line = null;
    this.isAnimation = false;
    this.polyline = false;
    this.direction = true;
    this.calcRoute();
  }

  selectfrom() {
    this.enddate = new Date();
  }
  clear() {
    this.filterData = {
      page: 1,
      limit: 20,
      authorizerUserMasterID: +localStorage.getItem('id'),
      userid: [],
      fromdate: '',
      todate: '',
      fromamount: '',
      toamount: '',
      product: [],
      expenseType: '',
    };
    this.filterdata.resetForm();
    this.rows = [];
    this.referencedata1 = null

    if (this.selectedTab == 'group') {
      this.getauthrequestdata();
    } else {
      this.expReqTableComponent.clear()
    }
  }
  filter() {
    if (!this.filterdata.valid) {
      return;
    }

    if (this.filterdata.value.fromdate > this.filterdata.value.todate) {
      return this.commonNotificationService.handleWarning(
        'Fromdate should be less then or equal to todate ',
      );
    }

    if (this.filterdata.value.expensename == '' || !this.filterdata.value.expensename) {
      this.filterData.userid = this.mainexpensename.map((d) => +d);
    } else {
      this.filterData.userid = this.filterdata.value?.expensename?.map((d) => +d);
    }
    this.filterData.fromdate = this.filterdata.value.fromdate;
    this.filterData.todate = this.filterdata.value.todate;
    this.filterData.expenseType = this.filterdata.value.expenseType;
    if (this.selectedTab == 'group') {
      this.getExpenseAuthByUser()
    }

    if (this.selectedTab == 'single') {
      this.filterData.userid = this.filterdata.value?.expensename?.length > 0 ? this.filterdata.value.expensename : this.mainexpensename.map((d) => +d);
      this.expReqTableComponent.filterData.fromdate = this.filterData.fromdate;
      this.expReqTableComponent.filterData.todate = this.filterData.todate;
      this.expReqTableComponent.filterData.expenseType = this.filterData.expenseType;
      this.expReqTableComponent.filterData.userid = this.filterData.userid;
      this.expReqTableComponent.filter();
    }
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListExpenseComponent',
      {
        ...this.filterData,
        navigatedFrom: 'ExpenserequestComponent',
        status: ''
      },
      '/finances/expense/edit_expense',
      rowData.userExpenseID,
    );
  }

  loadComponent(tab: string) {
    this.activeTab = tab;
    if (tab === 'timeline') {
      this.changeDate(this.referencedata1);
    } else {
      this.onSubmit2(this.referencedata1);
    }
  }

  changeDate(data: any) {
    if (this.activeTab === 'timeline') {
      this.total_kms = 0;
      let ToDate = data;
      // this.ToDate1 = data;

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
        userMasterID: data?.userMasterID,
        date: data?.expense_date,
      };
      this.spinner.start('track');
      this.api
        .callApi(this.constant.GETUSERTRACKINGDATA1, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.markers = res.data;
            this.directionInfoData = res.data;

            this.total_kms = res.data.trackingKM ? res.data.trackingKM : 0;

            //Address List -ALL POINTS
            this.info = res.data.trackingPoints;

            //Marker List -Tracking POINTS > 85Mtrs.
            this.markers1 = res.data.tracking;

            if (this.markers1 && this.markers1.length && this.markers1.length > 0) {
              this.isData = true;
              this.markers1_length = this.markers1.length;
              this.lat = parseFloat(this.markers1[0].Lattitude);
              this.lng = parseFloat(this.markers1[0].Longitude);

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
                      height: 40,
                    },
                  },
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
                    markerOptions: {
                      icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    },
                    markerColor: {
                      url: this.getMarkerColorUrl(this.markers1[i].type),
                      scaledSize: {
                        width: 40,
                        height: 40,
                      },
                    },
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
                      height: 40,
                    },
                  },
                });
              }

              this.address = this.markers1[0].Address;
              this.time = this.markers1[0].Track_datetime;

              this.battery = this.markers1[this.markers1_length - 1].Battery;
              this.gps = this.markers1[this.markers1_length - 1].Gps;
              this.developerMode = this.markers1[this.markers1_length - 1].developerMode;
              this.wifi = this.markers1[this.markers1_length - 1].Wifi;
              this.location = this.markers1[0].Address;
              this.mobile_name = this.markers1[0].Mobile_name;
              this.lat = parseFloat(this.markers1[0].Lattitude);
              this.lng = parseFloat(this.markers1[0].Longitude);
            } else {
              this.isData = false;
            }

            this.visit = this.markers.totalVisit;

            this.expense = this.markers.totalExpense;
            this.designation = this.markers.designation;
            this.department = this.markers.department;

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
    } else {
      this.onSubmit2(data);
    }
    // this.show = true;

    // this.toggle();
  }

  onSubmit2(data: any) {
    this.info = [];
    const filterData = {
      userMasterID: data?.userMasterID,
      date: data?.expense_date,
    }
    this.spinner.start('start');
    this.api
      .callApi(this.constant.GETUSERTRACKINGINFO, filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
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
            this.commonNotificationService.handleError(res.message);

            this.spinner.stop('start');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);

          this.spinner.stop('start');
        },
      );
  }

  handleRouteResponse(res, index) {
    const existIndex = this.tempArray.findIndex((x) => x.index == index);
    if (existIndex == -1) {
      this.tempArray.push({ route: res?.routes[0].overview_path, isPlayed: false, index: index });
    }
    this.tempArray.sort((a, b) => Number(a.index) - Number(b.index));
    this.assignMarker();
  }

  initRoute(removeLine = false) {
    let route;
    if (!removeLine) {
      this.mockDirections();
      route = this.line?.getPath().getArray();

      if (route.length > 0) {
        const options: TravelMarkerOptions = {
          map: this.mapInstance,
          speed: 700, // animation speed
          interval: 1, //marker refresh time
          cameraOnMarker: true,
          speedMultiplier: this.speedMultiplier,
          markerOptions: {
            title: 'Travel Marker',
            animation: google.maps.Animation.DROP,
            icon: {
              url: '../../../../../assets/track_car.png',
              animation: google.maps.Animation.DROP,
              scaledSize: new google.maps.Size(32, 32),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(15, 32),
            },
            zIndex: 999,
          },
        };

        this.marker = new TravelMarker(options);
        this.marker?.addLocation(route);
        this.markerEventListener = this.marker?.event?.onEvent(
          (event = 'finished', data: TravelData) => {
            if (
              this.isAnimation &&
              this.marker?.playing &&
              event == 'finished' &&
              data.status == 'finished'
            ) {
              this.isAnimation = false;
              this.resetAnimation = true;
            }
          },
        );
      }
    } else {
      this.assignMarker();
    }
  }
  assignMarker() {
    const index = this.tempArray.findIndex((x) => x.isPlayed == false);
    if (index != -1) {
      this.marker?.setMap(null);
      this.marker = null;
      const options: TravelMarkerOptions = {
        map: this.mapInstance,
        speed: 700,
        interval: 5,
        cameraOnMarker: true,
        speedMultiplier: this.speedMultiplier,
        markerOptions: {
          title: 'Travel Marker',
          // animation: google.maps.Animation.DROP,
          icon: {
            url: '../../../../../assets/track_car.png',
            // animation: google.maps.Animation.DROP,
            scaledSize: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 32),
          },
          zIndex: 999,
        },
      };
      this.marker = new TravelMarker(options);
      this.marker?.addLocation(this.tempArray[index].route);
    }

    this.marker?.event?.onEvent((event = 'finished', data: TravelData) => {
      if (
        this.isAnimation &&
        this.marker?.playing &&
        event == 'finished' &&
        data.status == 'finished'
      ) {
        this.isAnimation = false;
        this.resetAnimation = true;
        const index = this.tempArray.findIndex((x: any) => x.isPlayed == false);
        if (index != -1) {
          this.tempArray[index].isPlayed = true;
          if (index == this.tempArray.length - 1) {
            this.tempArray?.map((x) => {
              x.isPlayed = false;
            });
            return;
          }
          if (this.tempArray.findIndex((x: any) => x.isPlayed == false) != -1) {
            this.assignMarker();
            this.play();
          }
        } else {
          this.tempArray?.map((x) => {
            x.isPlayed = false;
          });
        }
        return;
      }
    });
  }
  play() {
    if (this.resetAnimation) {
      this.assignMarker();
      this.marker?.reset();
    }
    this.marker?.play();
    this.isAnimation = true;
    this.resetAnimation = false;
  }

  stop() {
    this.isAnimation = false;
    this.marker?.pause();
  }

  reset() {
    this.marker?.pause();
    this.tempArray?.map((x) => {
      x.isPlayed = false;
      return;
    });
    this.assignMarker();
    this.isAnimation = false;
    this.marker?.reset();
    this.resetAnimation = false;
  }

  mockDirections() {
    const locationArray = this.markers1?.map(
      (x) => new google.maps.LatLng(x?.Lattitude, x?.Longitude),
    );
    this.line = new google.maps.Polyline({
      strokeOpacity: 0.5,
      path: [],
      map: this.mapInstance,
      strokeColor: 'red',
    });
    if (locationArray.length > 0) {
      locationArray.forEach((l) => this.line?.getPath().push(l));
    } else {
    }
  }
  calcRoute() {
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    if (this.wayPoints.length == 0) {
      const start = new google.maps.LatLng(
        this.markers1[0]?.Lattitude,
        this.markers1[0]?.Longitude,
      );
      const end = new google.maps.LatLng(
        this.markers1[this.markers1.length - 1]?.Lattitude,
        this.markers1[this.markers1.length - 1]?.Longitude,
      );
      const request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
      };
      this.directionsService = new google.maps.DirectionsService();
      this.directionsService.route(request, (response, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
          var legs = response.routes[0].legs;
          for (let i = 0; i < legs.length; i++) {
            var steps = legs[i].steps;
            for (let j = 0; j < steps.length; j++) {
              var nextSegment = steps[j].path;
              for (let k = 0; k < nextSegment.length; k++) {
                this.line?.getPath().push(nextSegment[k]);
              }
            }
          }
          this.initRoute(true);
        } else {
        }
      });
    }
  }

  onMapReady(map: any) {
    this.mapInstance = map;
  }

  onModalClose() {
    this.showFinanceData = false;
    this.row = null;
    this.actionType = '';
  }

  showExpenseData(row: any) {
    this.showFinanceData = true;
    this.row = row;
  }


  getExpenseAuthByUser() {
    this.spinner.start('load');

    this.api
      .callApi(
        this.constant.GETEXPENSEAUTHBYUSER_V3,
        this.filterData,
        'POST',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data.map(item => ({ ...item, checkbox: false }));
            this.page.totalCount = res.totalcount;
            this.spinner.stop('load');
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('load');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('load');
        },
      );
  }

  checkAcceptReject(row: any) {
    const index = row?.userExpenseTransactions?.findIndex((x: any) => x.authorizationStatus == '0' || x.authorizationStatus == '1' || x.authorizationStatus == '2')
    return index != -1 ? true : false;
  }

  getBranchName(row: any): string {
    return row?.userMaster?.employeeBranches[0]?.branchMaster?.branchName || '';
  }
  getEmployeeCode(row: any): string {
    return row?.userMaster?.employeeJoiningDetails[0]?.employeeCode || '';
  }

  getDepartmentName(row: any): string {
    return (
      row?.userMaster?.employeeDepartments[0]?.department?.departmentName || ''
    );
  }

  getDesignationName(row: any): string {
    return (
      row?.userMaster?.employeeDesignations[0]?.designation?.designationName || ''
    );
  }

  getDivisionName(row: any): string {
    return row?.userMaster?.employeeDivisions[0]?.division?.divisionName || null;
  }

  selectTab(type: string) {
    this.selectedTab = type;
    this.newArray = [];
    if (type == 'group') {
      this.filter();
    } else {
      this.expReqTableComponent.filterData.fromdate = this.filterData.fromdate;
      this.expReqTableComponent.filterData.todate = this.filterData.todate;
      this.expReqTableComponent.filterData.expenseType = this.filterData.expenseType;
      this.expReqTableComponent.filterData.userid = this.filterData.userid;
      this.expReqTableComponent.filter();
    }
  }

  getNewArray(data: any) {
    this.newArray = data
  }

  getAuthorizer(userMasterIDs: any) {
    this.mainexpensename = userMasterIDs;
  }

}
