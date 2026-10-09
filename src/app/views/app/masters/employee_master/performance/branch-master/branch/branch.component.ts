import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
    selector: 'app-branch',
    templateUrl: './branch.component.html',
    styleUrls: ['./branch.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BranchComponent implements OnInit {

  rows4: any;

  constructor(
      private spinner: NgxUiLoaderService,
      public activatedRoute: ActivatedRoute,
      private api: ApiService,
      private constant: ConstantService,
  
    ) { }

  ngOnInit(): void {
    this.branchdata()
  }

  branchdata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETEMPLOYEEBRANCH + localStorage.getItem('id'),
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {

        if (res.status == 200) {
          this.rows4 = res.data;
          this.spinner.stop();
        }
      });
  }

}
