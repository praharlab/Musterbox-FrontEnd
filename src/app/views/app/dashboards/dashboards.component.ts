import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ChunkService } from 'src/app/services/chunk.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-dashboards',
    templateUrl: './dashboards.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DashboardsComponent {
  adminRoot: any = environment.adminRoot
  usertype: any;
  permissionview: any = [];
  constructor(private chunkService: ChunkService, private router: Router,
    private spinner: NgxUiLoaderService,
        private api: ApiService,
        private constant: ConstantService,
        public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.usertype = +localStorage.getItem('usertype');

    // Only usertype 2 and 3 have content on the `default` board; every other
    // role renders an empty page there. Analytics is their actual home, so
    // send them straight on. This used to sit behind a 500ms setTimeout, which
    // meant those users watched a blank dashboard while it elapsed - and stayed
    // there for good if the timer was missed. replaceUrl keeps Back from
    // bouncing them into the empty board again.
    if (this.usertype !== 2 && this.usertype !== 3) {
      const url = this.router.url;
      if (url.endsWith('/dashboards') || url.includes('/dashboards/default')) {
        this.router.navigate([`${this.adminRoot}/dashboards/analytics`], { replaceUrl: true });
      }
    }

    this.checkpermission();
  }

  navigate(path: any) {
    this.router.navigate([`${this.adminRoot}/dashboards/${path}`]);
  }

  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            const permission = res.data || [];
            this.permissionview = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'HrDashboard' &&
                permissionval.operationName.includes('View')
              );
            });
          }
          // stop unconditionally: a non-200 used to leave the loader spinning
          // forever, which is what made the dashboard look permanently blank.
          this.spinner.stop();
        },
        () => {
          this.permissionview = [];
          this.spinner.stop();
        },
      );
  }
}
