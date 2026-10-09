import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-asset-master',
    templateUrl: './asset-master.component.html',
    styleUrls: ['./asset-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AssetMasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  AssetArray: any = [];
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

    this.AssetArray = [
      {
        icon: 'iconsminds-computer',
        label: 'My Asset',
        menu: 'MyAssets',
        to: `${this.adminRoot}/assets/myasset`,
      },
      {
        icon: 'iconsminds-computer',
        label: 'Asset Assign  ',
        menu: 'AssetAsignEmp',
        to: `${this.adminRoot}/assets/assetassigntoemp`,
      },
    ];
  }
}
