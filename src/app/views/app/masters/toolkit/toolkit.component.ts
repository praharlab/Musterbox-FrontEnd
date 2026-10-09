import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-toolkit',
    templateUrl: './toolkit.component.html',
    styleUrls: ['./toolkit.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ToolkitComponent implements OnInit {
  rows: any;
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: '',
    limit: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  temp = [];
  apiURL = environment.apiUrl;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private http: HttpClient,
    private constant: ConstantService,
    private router: Router,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }
  ngOnInit(): void {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETHRTOOLKIT, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
  }

  downloadpdf(pdf: any) {
    // return this.http.get(this.apiURL + 'uploads/hrtoolkit/' + pdf.DocumentZip, {
    //   responseType: 'arraybuffer'
    // });

    const pdfUrl = this.apiURL + 'uploads/hrtoolkit/' + pdf.DocumentZip;
    const pdfName = pdf.DocumentName;
    saveAs(pdfUrl, pdfName);
  }
}
