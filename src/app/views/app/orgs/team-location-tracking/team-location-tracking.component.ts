import { Component, ViewChild, OnInit, ViewContainerRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LocationTrackingSummaryComponent } from '../location-tracking-summary/location-tracking-summary.component';
import { TravelData, TravelMarker, TravelMarkerOptions } from 'travel-marker';
import { CommonFilterButtonFields, CommonFilterFields } from 'src/app/constants/CommonFilterFields';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-team-location-tracking',
    templateUrl: './team-location-tracking.component.html',
    styleUrls: ['./team-location-tracking.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TeamLocationTrackingComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('componentContainer', { read: ViewContainerRef }) componentContainer: ViewContainerRef;

  user: any;
  startDate: string;
  items: any = [];
  apiURL = environment.apiUrl;
  lat: any = 23.0367;
  lng: any = 72.5118;
  //public origin = { lat: 24.799448, lng: 120.979021 };
  //public origin;
  // public destination;
  //public destination = { lat: 24.799524, lng: 120.975017 };
  permissionview: any = [];
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
  timeLineSortOrder: 'asc' | 'desc' = 'asc';
  wayPoints: any = []
  allWayPoints: any = []
  origin: any = { lat: '', lng: '' };
  destination: any = { lat: null, lng: null };
  tempArray: any = []
  originAndDestination = [];
  mapZoom: number = 20;

  // customIcon = {
  //   path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
  //   fillColor: 'yellow',
  //   fillOpacity: 1,
  //   strokeColor: 'yellow',
  //   strokeWeight: 2,
  //   scale: 3
  // };
  battery: any;
  gps: any;
  wifi: any;
  location: any;
  mobile_name: any;
  tempid: number;
  RADIANS: number = 180 / 3.14159265;
  KMS_IN_MILE: number = 1.609344;
  allWorkingArea: any;
  alldesignation: any;
  allDivision: any;
  divisionfilter: any;
  departmentfilter: any;
  designationfilter: any;
  workingareafilter: any;
  bodyData:{
    userMasterID: null,
    date: ''
  }
  users_Body = {
    companyMasterID: '',
    branchMasterID: [],
    departmentID: [],
    designationID: [],
    divisionId: [],
    workingAreaId: []
  }
  selecteddesig: any[];
  selectedDivision: any[];
  selectedWorkingArea: any[];
  selectedDepartment: any[];
  selectedUser: any[];
  selectedBranch: any[];

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit];

  public renderOptions = {
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: 'green',
      strokeOpacity: 0.9,
      strokeWeight: 4,
    }
  };

  selectVal: any = 'true';
  show: boolean = false;
  empList: any;
  selecteddata: any = [];
  operationdata: any = [];
  ipAddress: any;
  parentformdata: any = [];
  markers: any = [];
  markers1: any = [];
  markers_length: number;
  markers1_length: number;
  number: any;
  designation: any;
  Username: any;
  department: any;
  selecteddate: any;
  visit: any;
  expense: any;
  total_kms1: string;
  map: boolean = true;
  userinfo: boolean = false;
  alluserlist: boolean = true;
  tabuserinfo: boolean = true;
  tabuserlist: boolean = false;
  imgshow1: boolean;
  alldata1: any;
  childcompany: string;
  comp: any;
  total_kms: number;
  userTrackingData: any;
  directionInfoData: any;
  userTrackingData_length: any;
  developerMode: string;
  alluser: any;
  allbranch: any;
  isResetForm: boolean = false;
  alldepartment: any;
  company1: any;
  data1: any;
  activeTab: string = 'timeline';
  directionData: any[] = [];
  mapInstance: any
  line: any
  speedMultiplier = 10;
  marker: TravelMarker | any;
  directionsService: any;
  directionsRenderer: any
  isAnimation: boolean = false
  resetAnimation: boolean = false
  markerEventListener: any

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,

    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {
    this.checkpermission()
    this.startDate = new Date().toISOString().split('T')[0];
    this.childcompany = localStorage.getItem('childcompany');

    this.users_Body = {
      companyMasterID: '',
      branchMasterID: [],
      departmentID: [],
      designationID: [],
      divisionId: [],
      workingAreaId: []
    }
    this.alluser = [];
    this.allbranch = [];
    this.department = [];
    this.alldesignation = []
    this.allDivision = []
    this.allWorkingArea = []

    this.selectedBranch = [];
    this.selectedDepartment = [];
    this.selectedUser = [];
    this.selecteddesig = [];
    this.selectedDivision = [];
    this.selectedWorkingArea = [];
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    // Additional handling if needed
    if (tab === 'timeline') {
      this.onSubmit();
    } else {
      this.onSubmit2();
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

  // onSubmit() {
  //   if (!this.addcomp.valid) {
  //     return;
  //   }
  //   this.total_kms = 0;
  //   let ToDate = this.addcomp.value.selectedDate;

  //   this.markers1 = null;
  //   this.info = [];
  //   this.dirs = [];
  //   this.markers_length = null;
  //   this.address = null;
  //   this.time = '';

  //   this.battery = '';
  //   this.gps = '';
  //   this.wifi = '';
  //   this.location = '';
  //   this.mobile_name = '';
  //   this.developerMode = '';

  //   const filterData = {
  //     userMasterID: this.addcomp.value.user,
  //     date: ToDate,
  //   };

  //   this.spinner.start('start');
  //   this.api
  //     .callApi(this.constant.GETUSERTRACKINGDATA1, filterData, 'POST', true, false, true)
  //     .subscribe((res: any) => {
  //       if (res.status == 200) {
  //         this.markers = res.data;

  //         this.directionInfoData = res.data;

  //         this.total_kms = res.data.trackingKM ? res.data.trackingKM : 0;

  //         //Address List -ALL POINTS
  //         this.info = res.data.trackingPoints;

  //         //Marker List -Tracking POINTS > 85Mtrs.
  //         this.markers1 = res.data.tracking;


  //         if (this.markers1 && this.markers1.length && this.markers1.length > 0) {
  //           this.isData = true;
  //           this.markers1_length = this.markers1.length;

  //           if (this.markers1.length == 1) {
  //             this.dirs.push({
  //               origin: {
  //                 lat: parseFloat(this.markers1[0].Lattitude),
  //                 lng: parseFloat(this.markers1[0].Longitude),
  //               },
  //               renderOptions: {
  //                 suppressMarkers: true,
  //                 photo: res.data.photo,
  //                 tracking: res.data.tracking,
  //                 user: res.data.user,
  //               },
  //               markerOptions: { icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' },
  //               markerColor: {
  //                 url: this.getMarkerColorUrl(this.markers1[0].type),
  //                 scaledSize: {
  //                   width: 40,
  //                   height: 40
  //                 }
  //               }
  //             });

  //           } else {
  //             for (var i = 0; i < this.markers1_length - 1; i++) {
  //               this.dirs.push({
  //                 origin: {
  //                   lat: parseFloat(this.markers1[i].Lattitude),
  //                   lng: parseFloat(this.markers1[i].Longitude),
  //                 },
  //                 destination: {
  //                   lat: parseFloat(this.markers1[i + 1].Lattitude),
  //                   lng: parseFloat(this.markers1[i + 1].Longitude),
  //                 },
  //                 renderOptions: {
  //                   suppressMarkers: true,
  //                   photo: res.data.photo,
  //                   tracking: res.data.tracking,
  //                   user: res.data.user,
  //                 },
  //                 markerOptions: { icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' },
  //                 markerColor: {
  //                   url: this.getMarkerColorUrl(this.markers1[i].type),
  //                   scaledSize: {
  //                     width: 40,
  //                     height: 40
  //                   }
  //                 }
  //               });

  //             }
  //             this.dirs.push({
  //               origin: {
  //                 lat: parseFloat(this.markers1[this.markers1_length - 1].Lattitude),
  //                 lng: parseFloat(this.markers1[this.markers1_length - 1].Longitude),
  //               },
  //               renderOptions: {
  //                 suppressMarkers: true,
  //                 photo: res.data.photo,
  //                 tracking: res.data.tracking,
  //                 user: res.data.user,
  //               },
  //               markerOptions: { icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' },
  //               markerColor: {
  //                 url: this.getMarkerColorUrl(this.markers1[this.markers1_length - 1]),
  //                 scaledSize: {
  //                   width: 40,
  //                   height: 40
  //                 }
  //               }
  //             });
  //           }

  //           this.address = this.markers1[0].Address;
  //           this.time = this.markers1[0].Track_datetime;

  //           this.battery = this.markers1[this.markers1_length - 1].Battery;
  //           this.gps = this.markers1[this.markers1_length - 1].Gps;
  //           this.developerMode = this.markers1[this.markers1_length - 1].developerMode;

  //           this.wifi = this.markers1[this.markers1_length - 1].Wifi;
  //           this.location = this.markers1[0].Address;
  //           this.mobile_name = this.markers1[0].Mobile_name;
  //           this.lat = parseFloat(this.markers1[0].Lattitude);
  //           this.lng = parseFloat(this.markers1[0].Longitude);
  //         } else {
  //           this.isData = false;
  //         }

  //         // for (var k = 0; k < this.directionInfoData.tracking.length; k++) {
  //         //   this.info.push({
  //         //     address:
  //         //       this.directionInfoData.tracking[k].Address != 'not found'
  //         //         ? this.directionInfoData.tracking[k].Address
  //         //         : 'not found',
  //         //     time: this.directionInfoData.tracking[k].Track_datetime,
  //         //     type: this.directionInfoData.tracking[k].type,
  //         //     battery: this.directionInfoData.tracking[k].Battery,
  //         //     gps: this.directionInfoData.tracking[k].Gps,
  //         //     wifi: this.directionInfoData.tracking[k].Wifi,
  //         //     mobile_name: this.directionInfoData.tracking[k].Mobile_name,
  //         //   });
  //         // }

  //         this.visit = this.markers.totalVisit;

  //         this.expense = this.markers.totalExpense;
  //         this.designation = this.markers.designation;
  //         this.department = this.markers.department;

  //         if (this.markers.photo != '' && this.markers.photo != null) {
  //           var img = new Image();
  //           img.src = this.apiURL + 'uploads/user/photo/' + this.markers.photo;

  //           if (img.complete) {
  //             this.imgshow1 = true;
  //           } else {
  //             img.onload = () => {
  //               this.imgshow1 = true;
  //             };

  //             img.onerror = () => {
  //               this.imgshow1 = false;
  //             };
  //           }
  //         } else {
  //           this.imgshow1 = false;
  //         }
  //       }
  //       this.spinner.stop('start');
  //     });


  //   this.show = true;

  //   // this.toggle();
  // }

  clearMapData() {
    this.markers1 = null;
    this.info = [];
    this.dirs = [];
    this.directionData = [];
    this.markers_length = 0;
    this.address = null;
    this.time = '';
    this.battery = '';
    this.gps = '';
    this.wifi = '';
    this.location = '';
    this.mobile_name = '';
    this.developerMode = '';
    this.marker?.setMap(null)
    this.line?.setMap(null);
    this.line = null
    this.timeLineSortOrder = 'asc';
  }

  setAdditionalInfo() {
    // First marker data
    this.address = this.markers1[0].Address;
    this.time = this.markers1[0].Track_datetime;
    this.mobile_name = this.markers1[0].Mobile_name;
    this.lat = parseFloat(this.markers1[0]?.Lattitude);
    this.lng = parseFloat(this.markers1[0]?.Longitude);

    // Last marker data
    const lastMarker = this.markers1[this.markers_length - 1];
    this.battery = lastMarker.Battery;
    this.gps = lastMarker.Gps;
    this.wifi = lastMarker.Wifi;
    this.developerMode = lastMarker.developerMode;
  }

  getLogType(type: string): string {
    const logTypes = {
      checkin: 'Check-in',
      checkout: 'Check-out',
      login: 'Log-in',
      logout: 'Log-out',
      punchin: 'Punch-in',
      punchout: 'Punch-out',
    };
    return logTypes[type] || 'Location';
  }

  processApiResponse(data: any) {
    this.markers = data;
    this.directionInfoData = data;
    this.total_kms = data.trackingKM ? data.trackingKM : 0;
    this.info = data.trackingPoints;
    this.markers1 = data.tracking;
    if(this.markers1.length == 0){
      this.wayPoints = []
    }
    this.directionsRenderer?.setMap(null);
    this.tempArray = []
    this.marker?.setMap(null)
    this.marker = null
    this.markerEventListener = null;
    this.isData = true;
    // this.originAndDestination.push({
    //   origin: {
    //     lat: parseFloat(this.markers1[0].Lattitude),
    //     lng: parseFloat(this.markers1[0].Longitude)
    //   },
    //   destination: {
    //     lat: parseFloat(this.markers1[this.markers1.length - 1].Lattitude),
    //     lng: parseFloat(this.markers1[this.markers1.length - 1].Longitude)
    //   }
    // })

    if (this.markers1 && this.markers1.length > 0) {
      this.markers_length = this.markers1.length;
      this.prepareMapData();
      this.polyline ? this.initRoute() : this.calcRoute();
      this.setAdditionalInfo();
    }

    this.visit = this.markers.totalVisit;
    this.expense = this.markers.totalExpense;
    this.designation = this.markers.designation;
    this.department = this.markers.department;

    this.setUserImage(this.markers.photo);
  }

  prepareMapData() {
    this.dirs = [];
    const waypoints: any = [];

    if (this.markers1.length === 1) {
      // If only one marker is presnet
      this.dirs.push({
        origin: {
          lat: parseFloat(this.markers1[0]?.Lattitude),
          lng: parseFloat(this.markers1[0]?.Longitude),
        },
        renderOptions: {
          suppressMarkers: true,
          photo: this.markers.photo,
          tracking: this.markers.tracking,
          user: this.markers.user,
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
      // For multiple markers, create a series of directions and collect waypoints
      for (let i = 0; i <= this.markers_length - 1; i++) {
        this.dirs.push({
          origin: {
            lat: parseFloat(this.markers1[i]?.Lattitude),
            lng: parseFloat(this.markers1[i]?.Longitude),
          },
          destination: {
            lat: parseFloat(this.markers1[i + 1]?.Lattitude),
            lng: parseFloat(this.markers1[i + 1]?.Longitude),
          },
          renderOptions: {
            suppressMarkers: true,
            photo: this.markers.photo,
            tracking: this.markers.tracking,
            user: this.markers.user,
          },
          markerOptions: { icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' },
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
        // Not add duplicate points into the waypoints
        // if (!waypoints.some(wp => wp.location.lat === waypoint.lat && wp.location.lng === waypoint.lng)) {
        waypoints.push({ location: waypoint, stopover: true });
        // } 
      }



      const groupedWaypoints: any = [];
      let currentGroup: any = [];

      for (let i = 0; i < waypoints.length; i++) {
        currentGroup.push(waypoints[i]);
        if (currentGroup.length === 24) {
          groupedWaypoints.push({
            waypoint: currentGroup,
            origin: currentGroup[0]?.location,
            destination: currentGroup[currentGroup.length - 1]?.location
          });
          currentGroup = [];
        }
      }

      if (currentGroup.length > 0) {
        groupedWaypoints.push({
          waypoint: currentGroup,
          origin: currentGroup[0]?.location,
          destination: currentGroup[currentGroup.length - 1]?.location
        });
      }

      this.wayPoints = groupedWaypoints;
      this.dirs.push({
        origin: {
          lat: parseFloat(this.markers1[this.markers_length - 1]?.Lattitude),
          lng: parseFloat(this.markers1[this.markers_length - 1]?.Longitude),
        },
        renderOptions: {
          suppressMarkers: true,
          photo: this.markers.photo,
          tracking: this.markers.tracking,
          user: this.markers.user,
        },
        markerOptions: { icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' },
        markerColor: {
          url: this.getMarkerColorUrl(this.markers1[this.markers_length - 1].type),
          scaledSize: {
            width: 40,
            height: 40,
          },
        },
      });
    }

    // After processing all directions, update the waypoints
    this.allWayPoints = waypoints;

    if (this.dirs.length > 0) {
      this.origin = this.dirs[0]?.origin; // First element's origin
      this.destination = this.dirs[this.dirs.length - 1]?.origin; // Last element's origin (used as destination) because last one has no destination
    }
  }

  preparedirectionData() {
    this.directionData = this.markers1.map(marker => ({
      lat: parseFloat(marker?.Lattitude),
      lng: parseFloat(marker?.Longitude),
    }));
  }

  setUserImage(photoUrl: string) {
    if (photoUrl) {
      const img = new Image();
      img.src = `${this.apiURL}uploads/user/photo/${photoUrl}`;
      img.onload = () => this.imgshow1 = true;
      img.onerror = () => this.imgshow1 = false;
    } else {
      this.imgshow1 = false;
    }
  }

  onSubmit(val?: any) {
    this.total_kms = 0;
    if(val){
      this.bodyData = {
        date: val.selectedDate,
        userMasterID: val.user
      }
    }
    if(this.bodyData.date == '' && this.bodyData.userMasterID == null) return;
    
    this.clearMapData();

    const filterData = {
      userMasterID: this.bodyData.userMasterID,
      date: this.bodyData.date,
    };

    this.spinner.start('start');
    this.api
      .callApi(this.constant.GETUSERTRACKINGDATA1, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.processApiResponse(res?.data);
        }
        this.spinner.stop('start');
      },
      (error) => {
      });
    this.show = true;
  }

  onSubmit2() {

    const filterData = {
      userMasterID: this.bodyData.userMasterID,
      date: this.bodyData.date,
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
  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
  showpoly() {
    this.marker?.pause();
    this.directionsRenderer?.setMap(null);
    this.markerEventListener = null
    this.isAnimation = false
    this.polyline = true;
    this.direction = false;
    this.marker?.setMap(null)
    this.marker = null
    this.line?.setMap(null)
    this.tempArray = [];
    this.line = null
    this.initRoute()
  }
  showdir() {
    this.marker?.pause();
    this.markerEventListener = null
    this.tempArray = []
    this.marker?.setMap(null)
    this.marker = null
    this.line?.setMap(null)
    this.line = null
    this.isAnimation = false
    this.polyline = false;
    this.direction = true;
    this.calcRoute();
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }
  loadComponent(tab: string) {
    this.componentContainer.clear();

    let componentType;

    switch (tab) {
      case 'timeline':
        break;
      case 'summary':
        componentType = LocationTrackingSummaryComponent;
        break;

      default:
        // Handle other tabs as needed
        break;
    }

    if (componentType) {
      const componentRef = this.componentContainer.createComponent(componentType);
      const instance = componentRef.instance as LocationTrackingSummaryComponent;
      instance.userMasterID = this.bodyData.userMasterID;
      instance.selectedDate = this.bodyData.date;
    }
  }

  onMapReady(map: any) {
    this.mapInstance = map;
  }

  mockDirections() {
    const locationArray = this.markers1.map((x) => new google.maps.LatLng(x?.Lattitude, x?.Longitude));
    this.line = new google.maps.Polyline({
      strokeOpacity: 0.5,
      path: [],
      map: this.mapInstance,
      strokeColor: 'red'
    });
    locationArray.forEach((l) => this.line.getPath().push(l));
  }

  assignMarker() {
    const index = this.tempArray.findIndex((x) => x.isPlayed == false);
    if (index != -1) {
      this.marker?.setMap(null)
      this.marker = null;
      const options: TravelMarkerOptions = {
        map: this.mapInstance,
        speed: 700,
        interval: 1,
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
          zIndex: 999
        },
      };
      this.marker = new TravelMarker(options);
      this.marker?.addLocation(this.tempArray[index].route);
    }

    this.marker?.event?.onEvent((event = 'finished', data: TravelData) => {
      if (this.isAnimation && this.marker?.playing && event == 'finished' && data.status == 'finished') {
        this.isAnimation = false
        this.resetAnimation = true
        const index = this.tempArray.findIndex((x: any) => x.isPlayed == false)
        if (index !== -1) {
          this.tempArray[index].isPlayed = true;
          if(this.tempArray.findIndex((x: any) => x.isPlayed == false) != -1){
            this.assignMarker();
            this.play()
          }else{
            this.isAnimation = false
            this.resetAnimation = true
          }
        } else {
          this.tempArray?.map((x) => {
            x.isPlayed = false;
          })
        }
        return
      }
    })
  }

  initRoute(removeLine = false, directionRoute?: any) {
    let route;
    if (!removeLine) {
      this.mockDirections();
      route = this.line.getPath().getArray();

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
          zIndex: 999
        },
      };

      this.marker = new TravelMarker(options);
      this.marker?.addLocation(route)
      this.markerEventListener = this.marker?.event?.onEvent((event = 'finished', data: TravelData) => {
        if (this.isAnimation && this.marker?.playing && event == 'finished' && data.status == 'finished') {
          this.isAnimation = false
          this.resetAnimation = true
        }
      })
    } else {
      this.assignMarker()
    }
  }

  play() {
    if (this.resetAnimation) {
      this.marker?.reset()
      this.assignMarker()
    }
    this.marker?.play();
    this.isAnimation = true
    this.resetAnimation = false
  }

  stop() {
    this.isAnimation = false
    this.marker?.pause()
  }

  reset() {
    this.tempArray?.map((x) => {
      x.isPlayed = false;
      return
    })
    this.isAnimation = false
    this.marker?.reset()
    this.assignMarker()
    this.resetAnimation = false
  }

  calcRoute() {
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    if (this.wayPoints.length == 0) {
      const start = new google.maps.LatLng(this.markers1[0]?.Lattitude, this.markers1[0]?.Longitude);
      const end = new google.maps.LatLng(this.markers1[this.markers1.length - 1]?.Lattitude, this.markers1[this.markers1.length - 1]?.Longitude);
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
                this.line.getPath().push(nextSegment[k]);
              }
            }
          }
          const directionRoutes = response.routes[0].legs[0].steps.map((x) => x.end_point)
          this.initRoute(true, directionRoutes);
        } else {
        }
      });
    }
  }

  handleRouteResponse(res, index) {
    const existIndex = this.tempArray.findIndex((x) => x.index == index);
    if (existIndex == -1) {
      this.tempArray.push({ route: res.routes[0].overview_path, isPlayed: false, index: index });
    }
    const directionRoutes = res.routes[0].legs.map((x) => {
      return new google.maps.LatLng(x.end_location.lat(), x.end_location.lng());
    })
    this.tempArray.sort((a, b) => Number(a.index) - Number(b.index));
    this.initRoute(true, directionRoutes);
  }

  
  toggleTimelineSortOrder() {
    this.timeLineSortOrder = this.timeLineSortOrder === 'asc' ? 'desc' : 'asc';
    if (this.isData && this.info?.length) {
      this.info = this.info.sort((a, b) => {
        const timeA = new Date(a.time).getTime();
        const timeB = new Date(b.time).getTime();
        return this.timeLineSortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      });
    }
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
              permissionval.formName == 'AdminLocationTracking' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  ngOnDestroy(): void {
    this.formValueStorageService.removeData('commonFilterData', true)
  }
}