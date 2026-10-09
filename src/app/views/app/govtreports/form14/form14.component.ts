import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-form14',
    templateUrl: './form14.component.html',
    styleUrls: ['./form14.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Form14Component implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  finaldata: boolean = false;
  filterData = {
    page: 1,
    limit: 10,
    id: localStorage.getItem('company_id'),
  };

  body = {
    companyMasterID: '',
    branchMasterID: '',
  };

  events: any;
  filter: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;

  company_id: any;

  company1: any;

  image: any;
  image1: any;

  branch: any;
  companyData: any;
  id: any;

  branch1: any;
  excelevents: any;
  dob: void;
  imgshow1: boolean;
  imgshow: boolean;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.company_id = localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();
  }
  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };

    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;

          this.spinner.stop();
        }
      });
  }

  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'IdCardRegistery' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop();
        }
      });
  }

  onSubmit() {

    this.body.companyMasterID = this.datefilter.value.company;

    this.body.branchMasterID = this.datefilter.value.branch;

    this.spinner.start();
    this.api
      .callApi(this.constant.GETFORM14, this.body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;

          this.selectBranch();

          this.spinner.stop();
          
        }
      });

    this.finaldata = true;
  }

  selectcompany(id) {
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.branch = res;

        this.spinner.stop();
      });

    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWCOMPANYDATA + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.companyData = res.data;
        }
      });
  }
  selectBranch() {
    this.api
      .callApi(
        this.constant.VIEWBRANCH + this.datefilter.value.branch,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.branch1 = res.data;
        }
      });
  }

  editimage(image) {
    this.image = image;
  }

  clear() {
    this.datefilter.resetForm();
    setTimeout(() => {
      this.ngOnInit();
      this.rows = [];
    }, 100);
  }
  downloadPdf() {
    this.spinner.start();
    let data = document.getElementById('content-data');
    html2canvas(data, { scale: 5, useCORS: true, allowTaint: true, scrollY: 0 }).then((canvas) => {
      const image = { type: 'png', quality: 100 };
      const margin = [1, 1];
      const filename = 'myfile.pdf';

      var pageHeight = 16.5;
      var imgWidth = 11.7;

      var innerPageWidth = imgWidth - margin[0] * 2;
      var innerPageHeight = pageHeight - margin[1] * 2;

      var pxFullHeight = canvas.height;
      var pxPageHeight = Math.floor(canvas.width * (pageHeight / imgWidth));
      var nPages = Math.ceil(pxFullHeight / pxPageHeight);

      var pageHeight = innerPageHeight;

      var pageCanvas = document.createElement('canvas');
      var pageCtx = pageCanvas.getContext('2d');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pxPageHeight;

      var pdf = new jsPDF('p', 'in', 'a3');
      // pdf.internal.scaleFactor = 30;
      for (var page = 0; page < nPages; page++) {
        if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
          pageCanvas.height = pxFullHeight % pxPageHeight;
          pageHeight = (pageCanvas.height * innerPageWidth) / pageCanvas.width;
        }

        var w = pageCanvas.width;
        var h = pageCanvas.height;
        pageCtx.fillStyle = 'gray';

        pageCtx.fillRect(20, 20, w, h);

        pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);

        if (page > 0) pdf.addPage();
        var imgData = pageCanvas.toDataURL('image/png' + image.type, image.quality);
        pdf.addImage(
          imgData,
          image.type,
          margin[1],
          margin[0],
          innerPageWidth,
          pageHeight,
          'someAlias',
          'FAST',
        );
      }

      pdf.save('Form14' + '.pdf');
      window.location.reload();
    });
  }

}
