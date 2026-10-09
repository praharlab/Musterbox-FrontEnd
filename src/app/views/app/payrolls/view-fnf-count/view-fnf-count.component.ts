import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
    selector: 'app-view-fnf-count',
    templateUrl: './view-fnf-count.component.html',
    styleUrls: ['./view-fnf-count.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ViewFNFCountComponent implements OnInit {
  @Input() childData!: { userMasterID: number[]; month: string };
  count = 0;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
  ) { }

  ngOnInit(): void {
    this.getCount();

  }

  getCount() {

    this.api
      .callApi(this.constant.GETFNFCOUNT, this.childData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.count = res.count;
        }
      });
  }

}
