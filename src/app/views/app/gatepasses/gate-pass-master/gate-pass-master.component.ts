import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-gate-pass-master',
    templateUrl: './gate-pass-master.component.html',
    styleUrls: ['./gate-pass-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class GatePassMasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  GatePassArray: any = [];
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

    this.GatePassArray = [
      {
        icon: 'iconsminds-id-card',
        label: 'Gate Pass Dashboard',
        menu: 'GatePassEntry',
        to: `${this.adminRoot}/gatepasses/gatepass-dashboard`,
      },
      {
        icon: 'iconsminds-newspaper',
        label: 'My Gate Pass',
        menu: 'MyGatePass',
        to: `${this.adminRoot}/gatepasses/mygatepass`,
      },

      {
        icon: 'iconsminds-id-card',
        label: 'Gate Pass',
        menu: 'GatePassEntry',
        to: `${this.adminRoot}/gatepasses/gatepass`,
      },
    ];
  }
}
