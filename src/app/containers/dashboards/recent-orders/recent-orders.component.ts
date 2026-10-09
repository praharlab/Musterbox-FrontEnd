import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { IProduct } from 'src/app/data/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
@Component({
    selector: 'app-recent-orders',
    templateUrl: './recent-orders.component.html',
    styleUrls: ['./recent-orders.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class RecentOrdersComponent implements OnInit {
  @ViewChild('openModal', { static: false }) openModal: ModalDirective;
  @ViewChild('dateFilterImmediate') dateFilterImmediate: NgForm;
  apiURL = environment.apiUrl;
  showloader: any = 'true';
  teamData: any = [];
  immediateChildData: any = [];
  currentUser: any;
  maindata: IProduct[];
  id: string;
  imgshow1: boolean;
  logData: any = [];
  userName: any = '';
  image: any;
  Curr_component: string = 'ImmadiateTeam';
  currentDate: string;
  maxDate: string;
  search: string;
  private searchSubject = new Subject<string>();
  myTeamData: any = [];

  constructor(
    private api: ApiService,
    private constant: ConstantService,
    private spinner: NgxUiLoaderService,
  ) {}
  ngOnInit(): void {
    this.id = localStorage.getItem('id');
    this.currentDate = new Date().toISOString().slice(0, 10);
    this.maxDate = new Date().toISOString().slice(0, 10);
    this.immediateReportToData();

    this.searchSubject
      .pipe(
        debounceTime(300), // Adjust debounce time as needed
        tap((searchTerm) => {
          this.search = searchTerm;
          if (this.Curr_component === 'ImmadiateTeam') {
            this.immediateReportToData();
          } else {
            this.myTeamSearch();
          }
        }),
      )
      .subscribe();
  }
  onDateSelect(eventData) {
    if (!this.dateFilterImmediate.valid) {
      return;
    }
    this.showloader = 'true';
    this.currentDate = eventData.target.value;
    if (this.Curr_component == 'ImmadiateTeam') {
      this.immediateReportToData();
    } else {
      this.teamReportToData();
    }
  }
  immediateReportToData() {
    let queryString = `?userMasterID=${this.id}&date=${this.currentDate}`;

    if (this.search) {
      queryString += `&search=${this.search}`;
    }
    this.api
      .callApi(this.constant.REPORTSTOIMMEDIATECHILD + queryString, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.immediateChildData = res.data.child;
          this.currentUser = res.data.currentUser;
          this.showloader = 'false';
        },
        (err) => {
          console.log(err, 'ERROR');
        },
      );
  }
  teamReportToData() {
    const body = {
      userMasterID: this.id,
      AttendanceDate: this.currentDate,
    };
    this.api
      .callApi(this.constant.REPORTSTOWITHOUTCHIDDATEWISE, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          this.myTeamData = res.data;
          this.teamData = res.data;
          this.showloader = 'false';
        },
        (err) => {
          console.log(err, 'ERROR');
        },
      );
  }

  View(attendance_data) {
    this.userName = attendance_data.employee.displayName;
    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.GETATTENDANCELOGBYTRANSID + attendance_data.attendanceData.AttendanceTransID,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          this.logData = res.data;
          this.openModal.show();
          this.spinner.stop('start');
        },
        (err) => {
          console.log(err, 'ERROR');
          this.spinner.stop('start');
        },
      );
  }

  ViewCurrentUserData(displayName, AttendanceTransID) {
    this.userName = displayName;
    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.GETATTENDANCELOGBYTRANSID + AttendanceTransID,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          this.logData = res.data;
          this.openModal.show();
          this.spinner.stop('start');
        },
        (err) => {
          console.log(err, 'ERROR');
          this.spinner.stop('start');
        },
      );
  }

  editimage(image) {
    this.image = image;
  }

  loadComponent(component) {
    if (component) this.Curr_component = component;

    if (component == 'ImmadiateTeam') this.immediateReportToData();

    if (component == 'MyTeam') this.teamReportToData();
  }

  onSearch(event) {
    const searchTerm = event ? event : '';
    this.searchSubject.next(searchTerm);
  }

  myTeamSearch() {
    this.teamData = this.myTeamData.filter((item) => {
      const displayNameMatch = item.employee.displayName.toLowerCase().includes(this.search.toLowerCase());
      
      let employeeCodeMatch = false;
      if (item.employee && item.employee.employeeJoiningDetails) {
        for (const detail of item.employee.employeeJoiningDetails) {
          if (detail.employeeCode && detail.employeeCode.includes(this.search)) {
            employeeCodeMatch = true;
            break;
          }
        }
      }
  
      return displayNameMatch || employeeCodeMatch;
    });
  }
  
}
