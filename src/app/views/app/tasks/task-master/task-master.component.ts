import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-task-master',
    templateUrl: './task-master.component.html',
    styleUrls: ['./task-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TaskMasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  TaskArray: any = [];
  dailyReportingArray: any = [];

  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
  ) { }

  ngOnInit(): void {
    this.spinner.start('oninit');
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.formdata = res.master;
          this.visible = true;
          this.spinner.stop('oninit');
        }
      });
    this.dailyReportingArray = [
      {
        icon: 'iconsminds-books',
        label: 'Daily Reporting',
        menu: 'ViewDailyReporting',
        to: `${this.adminRoot}/tasks/dailyTask`,
      },
      {
        icon: 'iconsminds-books',
        label: 'Team Daily Reporting',
        menu: 'TeamDailyReporting',
        to: `${this.adminRoot}/tasks/Team-Daily-Reporting`,
      },

      {
        icon: 'iconsminds-books',
        label: 'My Daily Reporting',
        menu: 'DailyUserReporting',
        to: `${this.adminRoot}/tasks/user_dailyTask`,
      },
    ];
    this.TaskArray = [
      {
        icon: 'iconsminds-books',
        label: 'Task Dashboard',
        menu: 'TaskDashboard',
        to: `${this.adminRoot}/tasks/taskDashboard`,
      },
      {
        icon: 'iconsminds-books',
        label: 'Assign Task',
        menu: 'AssignTask',
        to: `${this.adminRoot}/tasks/task`,
      },
      {
        icon: 'iconsminds-books',
        label: 'My Task',
        menu: 'MyTask',
        to: `${this.adminRoot}/tasks/myTask`,
      },
    ];
  }
}
