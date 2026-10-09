import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { TaskCreatedAndStartDateGraphComponent } from '../task-created-and-start-date-graph/task-created-and-start-date-graph.component';
import { TaskStatusCountByCompanyGraphComponent } from '../task-status-count-by-company-graph/task-status-count-by-company-graph.component';
import { TaskStatusCountByUsersGraphComponent } from '../task-status-count-by-users-graph/task-status-count-by-users-graph.component';
import { PendingTaskPercentageWiseGraphComponent } from '../pending-task-percentage-wise-graph/pending-task-percentage-wise-graph.component';
@Component({
    selector: 'app-task-dashboard',
    templateUrl: './task-dashboard.component.html',
    styleUrls: ['./task-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TaskDashboardComponent implements OnInit {
  constructor(
    private api: ApiService,
    private constant: ConstantService,

  ) {}
  @ViewChild(TaskCreatedAndStartDateGraphComponent)
  taskCreatedAndStartDateGraphComponent: TaskCreatedAndStartDateGraphComponent;
  @ViewChild(TaskStatusCountByCompanyGraphComponent)
  taskStatusCountByCompanyGraphComponent: TaskStatusCountByCompanyGraphComponent;
  @ViewChild(TaskStatusCountByUsersGraphComponent)
  taskStatusCountByUsersGraphComponent: TaskStatusCountByUsersGraphComponent;
  @ViewChild(PendingTaskPercentageWiseGraphComponent)
  pendingTaskPercentageWiseGraphComponent: PendingTaskPercentageWiseGraphComponent;
  companyData: any = [];
  companyId: string;
  defaultCompany: number;
  ngOnInit(): void {
    this.companyId = localStorage.getItem('company_id');
    this.defaultCompany = +localStorage.getItem('company_id');
    this.getcompany();
  }
  getcompany() {
    const body = {
      companyMasterID: this.companyId,
    };
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.companyData = res.data;
        }
      });
  }

  onCompanyIdChange(event: any) {
    if (!event) {
      return;
    }
    this.companyId = event;

    //taskCreatedAndStartDateGraphComponent;
    this.taskCreatedAndStartDateGraphComponent.defaultValue.companyid = event;
    this.taskCreatedAndStartDateGraphComponent.ngOnDestroy();
    this.taskCreatedAndStartDateGraphComponent.getTaskDashboardData();

    //TaskStatusCountByCompanyGraphComponent
    this.taskStatusCountByCompanyGraphComponent.defaultValue.companyid = event;
    this.taskStatusCountByCompanyGraphComponent.ngOnDestroy();
    this.taskStatusCountByCompanyGraphComponent.getTaskStatusCountData();

    //TaskStatusCountByUsersGraphComponent
    this.taskStatusCountByUsersGraphComponent.defaultValue.companyid = event;
    this.taskStatusCountByUsersGraphComponent.ngOnDestroy();
    this.taskStatusCountByUsersGraphComponent.getTaskDashboardData();

    //PendingTaskPercentageWiseGraphComponent
    this.pendingTaskPercentageWiseGraphComponent.defaultValue.companyid = event;
    this.pendingTaskPercentageWiseGraphComponent.ngOnDestroy();
    this.pendingTaskPercentageWiseGraphComponent.getTaskDashboardData();
  }
}
