import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-checklist-master',
    templateUrl: './checklist-master.component.html',
    styleUrls: ['./checklist-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ChecklistMasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  TaskArray: any = [];
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
  ) {}

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

    this.TaskArray = [
      {
        icon: 'iconsminds-notepad',
        label: 'Check List',
        menu: 'CheckListMaster',
        to: `${this.adminRoot}/checklists/checklist`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Check List Questions',
        menu: 'CheckListQuestion',
        to: `${this.adminRoot}/checklists/checklistQuestion`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'My Check List',
        menu: 'MyCheckList',
        to: `${this.adminRoot}/checklists/userCheckList`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Admin CheckList',
        menu: 'AdminCheckList',
        to: `${this.adminRoot}/checklists/checklistadmin`,
      },
    ];
  }
}
