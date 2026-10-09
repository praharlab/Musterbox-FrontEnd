import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { TravelData, TravelMarker, TravelMarkerOptions } from 'travel-marker';

@Component({
    selector: 'app-user-tracking',
    templateUrl: './user-tracking.component.html',
    styleUrls: ['./user-tracking.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UserTrackingComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
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
  public dirs: Array<any> = [];
  public info: Array<any> = [];
  address: any;
  time: any;
  isData: boolean = false;
  name: any = 'Name';
  view: string = 'true';
  defaultVal: boolean = true;
  polyline: boolean = true;
  direction: boolean = false;
  timeLineSortOrder: 'asc' | 'desc' = 'asc';

  battery: any;
  gps: any;
  wifi: any;
  location: any;
  mobile_name: any;
  tempid: number;

  RADIANS: number = 180 / 3.14159265;
  // METRES_IN_MILE: number = 1609.34;
  KMS_IN_MILE: number = 1.609344;

  public renderOptions = {
    suppressMarkers: true,
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
  total_kms: any;
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
  // userinfo: boolean = false;
  // alluserlist: boolean = true;
  // tabuserinfo: boolean = true;
  // tabuserlist: boolean = false;
  userinfo: boolean = false;
  alluserlist: boolean = true;
  tabuserinfo: boolean = true;
  tabuserlist: boolean = false;
  imgshow1: boolean;
  alldata1: any;
  userTrackingData: any;
  userTrackingData_length: any;
  travelMode: string;
  directionInfoData: any;
  developerMode: any;
  activeTab: string = 'timeline';
  ToDate1: any;

  mapZoom: number = 20;
  wayPoints: any = []
  tempArray: any = []
  marker: TravelMarker | any;
  resetAnimation: boolean = false
  isAnimation: boolean = false
  speedMultiplier = 10;
  mapInstance: any
  markerEventListener: any
  line: any
  directionsRenderer: any
  directionsService: any


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
    this.startDate = new Date().toISOString().split('T')[0];
    this.tempid = this.activatedRoute.snapshot.params.id;
    this.getIPAddress();
    this.allparentform(localStorage.getItem('id'));
  }

  onFilterChange(id: any, name1: any) {
    this.tempid = id;
    this.name = name1;

    this.toggle();
  }
  getMarkerColorUrl(item: any) {
    if (!item) return '/assets/logos/location_icon.png';

    if (item == "punchin") return '/assets/logos/location_dark_green.png';
    else if (item == "punchout") return '/assets/logos/location_dark_grey.png';
    else if (item == "checkin") return '/assets/logos/location_light_green.png';
    else if (item == "checkout") return '/assets/logos/location_light_grey.png';
    else return '/assets/logos/location_icon.png';

  }


  changeDate(data: any) {
    this.defaultVal = true
    this.marker?.pause();
    this.marker?.setMap(null)
    this.marker = null
    this.directionsRenderer?.setMap(null);
    this.markerEventListener = null
    this.tempArray = [];
    this.isAnimation = false
    this.polyline = true;
    this.direction = false;
    this.line?.setMap(null)
    this.line = null
    this.wayPoints = []
    this.timeLineSortOrder = 'asc';

    if (this.activeTab === 'timeline') {
      this.total_kms = 0;
      let ToDate = data;
      this.ToDate1 = data;

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
        userMasterID: this.tempid,
        date: ToDate,
      };
      const filterData1 = {
        userMasterID: this.tempid,
        date: ToDate,
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

            this.polyline ? this.initRoute() : this.calcRoute();

            if (this.markers1 && this.markers1.length && this.markers1.length > 0) {
              const waypoints: any = []
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
                      lat: parseFloat(this.markers1[i]?.Lattitude),
                      lng: parseFloat(this.markers1[i]?.Longitude),
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
                    markerOptions: { icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' },
                    markerColor: {
                      url: this.getMarkerColorUrl(this.markers1[i].type),
                      scaledSize: {
                        width: 40,
                        height: 40
                      }
                    }
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
                }
                waypoints.push({ location: destinationWaypoint, stopover: true })

                const groupedWaypoints: any = [];
              let currentGroup: any = [];

              for (let i = 0; i < waypoints.length; i++) {
                currentGroup.push(waypoints[i]);

                if (currentGroup.length === 24) {
                  // groupedWaypoints.push(currentGroup);
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
                    url: this.getMarkerColorUrl(this.markers1[this.markers1_length - 1].type),
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
    this.show = true;

    // this.toggle();
  }

  onSubmit2(data: any) {
    this.ToDate1 = data;

    const filterData = {
      userMasterID: this.tempid,
      date: this.startDate,
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

  toggle() {
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
    this.travelMode = 'DRIVING';

    const filterData = {
      userMasterID: this.tempid,
      date: this.startDate,
    };
    const filterData1 = {
      userMasterID: this.tempid,
      date: this.startDate,
    };

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



          // this.polyline ? this.initRoute() : this.calcRoute();


          if (this.markers1 && this.markers1.length && this.markers1.length > 0) {
            const waypoints: any = []
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



                const waypoint = {
                  lat: parseFloat(this.markers1[i]?.Lattitude),
                  lng: parseFloat(this.markers1[i]?.Longitude),
                };
                waypoints.push({ location: waypoint, stopover: true });
              }

              const groupedWaypoints: any = [];
              let currentGroup: any = [];

              for (let i = 0; i < waypoints.length; i++) {
                currentGroup.push(waypoints[i]);

                if (currentGroup.length === 24) {
                  // groupedWaypoints.push(currentGroup);
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
              // this.wayPoints = groupedWaypoints;
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

    //           let kms = Number(calcCrow(lat1, lon1, lat2, lon2)) ? Number(calcCrow(lat1, lon1, lat2, lon2)) : 0;;
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

    //           let kms = Number(calcCrow(lat1, lon1, lat2, lon2)) ? Number(calcCrow(lat1, lon1, lat2, lon2)) : 0;;
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
    //       } else {
    //         this.isData = false;
    //       }

    //       this.spinner.stop();
    //     }
    //   });

    this.show = true;
  }

  showpoly() {
    this.marker?.pause();
    this.marker?.setMap(null)
    this.marker = null
    this.defaultVal = true
    this.directionsRenderer?.setMap(null);
    this.markerEventListener = null
    this.tempArray = [];
    this.isAnimation = false
    this.polyline = true;
    this.direction = false;
    this.line?.setMap(null)
    this.line = null
    this.initRoute()
  }
  showdir() {
    this.defaultVal = false
    this.marker?.pause();
    this.markerEventListener = null
    this.tempArray.map((x) => {x.isPlayed = false})
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

  allparentform(id: any) {
    this.spinner.start('allparent');
    this.api
      .callApi(this.constant.REPORTTO + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.items = res.data;
          this.Username = this.items[0].name;
          this.number = this.items[0].userNumber;
        }
        this.spinner.stop('allparent');
      });
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  currentItem;

  selectedItem(item) {
    this.currentItem = item;
    this.tempid = this.currentItem.userMasterID;

    this.toggle();
    this.usersinfo();
  }
  usersinfo() {
    this.tabuserinfo = false;
    this.alluserlist = false;
    this.userinfo = true;
    this.tabuserlist = true;
  }

  allusertrack() {
    if (this.tabuserinfo == false) {
      window.location.reload();
    }
    this.tabuserinfo = true;
    this.alluserlist = true;
    this.userinfo = false;
    this.tabuserlist = false;
  }

  loadComponent(tab: string) {

    this.activeTab = tab;

    if (tab === 'timeline') {
      this.changeDate(this.ToDate1);
    } else {
      this.onSubmit2(this.startDate);
    }
  }

  handleRouteResponse(res, index) {

    const existIndex = this.tempArray.findIndex((x) => x.index == index);
    if (existIndex == -1) {
      this.tempArray.push({ route: res?.routes[0].overview_path, isPlayed: false, index: index });
    }
    this.tempArray.sort((a, b) => Number(a.index) - Number(b.index));




    this.assignMarker()
  }

  initRoute(removeLine = false) {

    let route;
    if (!removeLine) {
      this.mockDirections();
      route = this.line?.getPath().getArray();
      
      if (route.length > 0) {

        const options: TravelMarkerOptions = {
          map: this.mapInstance,
          speed: 300, // animation speed
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
      }
    } else {
      this.assignMarker()
    }
  }
  assignMarker() {
    const index = this.tempArray.findIndex((x) => x.isPlayed == false);
    if (index != -1) {
      this.marker?.setMap(null)
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
        if (index != -1) {
          this.tempArray[index].isPlayed = true;
          if (index == this.tempArray.length - 1) {
            this.tempArray?.map((x) => {
              x.isPlayed = false;
            })
            return
          }
          if (this.tempArray.findIndex((x: any) => x.isPlayed == false) != -1) {
            this.assignMarker();
            this.play()
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
  play() {

    if (this.resetAnimation) {
      this.assignMarker()
      this.marker?.reset()
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
    this.marker?.pause()
    this.tempArray?.map((x) => {
      x.isPlayed = false;
      return
    })
    this.assignMarker()
    this.isAnimation = false
    this.marker?.reset()
    this.resetAnimation = false
  }

  mockDirections() {

    const locationArray = this.markers1?.map((x) => new google.maps.LatLng(x?.Lattitude, x?.Longitude));
    this.line = new google.maps.Polyline({
      strokeOpacity: 0.5,
      path: [],
      map: this.mapInstance,
      strokeColor: 'red'
    });
    if (locationArray.length > 0) {
      locationArray.forEach((l) => this.line.getPath().push(l));
    } else {
    }
  }
  calcRoute() {
    // this.directionsRenderer = new google.maps.DirectionsRenderer();
    // if (this.wayPoints.length == 0) {
    //   const start = new google.maps.LatLng(this.markers1[0]?.Lattitude, this.markers1[0]?.Longitude);
    //   const end = new google.maps.LatLng(this.markers1[this.markers1.length - 1]?.Lattitude, this.markers1[this.markers1.length - 1]?.Longitude);
    //   const request = {
    //     origin: start,
    //     destination: end,
    //     travelMode: google.maps.TravelMode.DRIVING,
    //   };
    //   this.directionsService = new google.maps.DirectionsService();
    //   this.directionsService.route(request, (response, status) => {
    //     if (status == google.maps.DirectionsStatus.OK) {
    //       var legs = response.routes[0].legs;
    //       for (let i = 0; i < legs.length; i++) {
    //         var steps = legs[i].steps;
    //         for (let j = 0; j < steps.length; j++) {
    //           var nextSegment = steps[j].path;
    //           for (let k = 0; k < nextSegment.length; k++) {
    //             this.line?.getPath().push(nextSegment[k]);
    //           }
    //         }
    //       }
    //       this.initRoute(true);
    //     } else {
    //     }
    //   });
    // }
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

  onMapReady(map: any) {
    this.mapInstance = map;

  }
}