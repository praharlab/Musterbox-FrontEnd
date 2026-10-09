import {
  Component,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-analytics',
    templateUrl: './analytics.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AnalyticsComponent implements OnInit{

  adminRoot : any = environment.adminRoot;
  navbarOpen = false;
  permissionview: any = [];
  tabDisplay = 0;
  webPunchInPermission: any = [];
  birthdayPermission: any = [];
  anniversaryPermission: any = [];
  activeTabName: string;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngAfterViewInit() {
  }

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
          this.webPunchInPermission = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'WebPunchInPunchOut' && permissionval.operationName.includes('Create')
            );
          });

          this.birthdayPermission = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'BirthdayList' && permissionval.operationName.includes('View')
            );
          });

          this.anniversaryPermission = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'WorkAnniversaryList' && permissionval.operationName.includes('View')
            );
          });

          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'HrDashboard' &&
              permissionval.operationName.includes('View')
            );
          });

          if (this.permissionview.length > 0) {
            this.tabDisplay = 1;
          } else {
            this.tabDisplay = 2;
          }
          this.spinner.stop();
        }
      });
  }

  loadComponent(tab: string) {
    this.activeTabName  = tab;
  }

  navigateToHrDashboard(){
    this.router.navigate([`${this.adminRoot}/dashboards/hr-dashboard`]);
  }
}
