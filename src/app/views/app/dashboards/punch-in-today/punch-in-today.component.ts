import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-punch-in-today',
    templateUrl: './punch-in-today.component.html',
    styleUrls: ['./punch-in-today.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PunchInTodayComponent implements OnInit {
  @ViewChild('dateFilter') dateFilter: NgForm;
  adminRoot = environment.adminRoot;
  apiURL = environment.apiUrl;

  punchInCount: number = 0;
  currentDate: string;
  showloader: boolean = true;
  maxDate: string;
  loaderstatus:boolean = false

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService
  ) {}

  ngOnInit(): void {
    this.currentDate = new Date().toISOString().slice(0, 10);
    this.maxDate = new Date().toISOString().slice(0, 10);
    this.getPunchInCount();
  }

  onDateSelect(eventData) {
    this.showloader = true;
    this.currentDate = eventData.target.value;
    this.getPunchInCount();
  }

  getPunchInCount() {
    // this.spinner.start();
    this.loaderstatus = ! this.loaderstatus
    const filterData = {
      date: this.currentDate 
    };

    this.api.callApi(this.constant.TOTALPUNCHIN, filterData, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.punchInCount = res.data;
          
        } 
        this.loaderstatus = ! this.loaderstatus
        // this.spinner.stop();
        this.showloader = false;
      });
  }

}
