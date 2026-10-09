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
import jspdf from 'jspdf';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
@Component({
    selector: 'app-adultworkersregister',
    templateUrl: './adultworkersregister.component.html',
    styleUrls: ['./adultworkersregister.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AdultworkersregisterComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
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
    companyMasterId: '',
    branchMasterID: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
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
  branch: any;
  companyData: any;
  id: any;
  branch1: any;
  excelevents: any;
  display = false;
  branchAddress_display = true;
  companyAddress_display = false;
  User: any = [];
  orderByValue

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
    this.orderByValue = 'displayName'
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
              permissionval.formName == 'AdultWorkerRegistery' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  public convetToPDF() {
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then((canvas) => {
      // Few necessary setting options
      var imgWidth = 300;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('l', 'mm', 'a3'); // A3  size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('new-file.pdf'); // Generated PDF
    });
    // var doc = new jsPDF("landscape");
    // autoTable(doc, {
    //   html: "#contentToConvert",
    //   theme: "grid",

    //   headStyles: {
    //     lineWidth: 0.5,
    //     lineColor: [0, 0, 0],
    //     fillColor: [255, 255, 255],
    //     textColor: [0, 0, 0],
    //     halign: "center",
    //     valign: "middle",
    //   },
    //   bodyStyles: {
    //     lineColor: [0, 0, 0],
    //     cellPadding: 4,
    //     valign: "middle",
    //     fontSize: 10,
    //     // halign: 'center'
    //     fontStyle: 'bold'

    //   },

    //   // body: rowData,
    //   styles: { fontSize: 8, font: 'Times New Roman'},
    //   // margin: { top: 50 },
    //   startY: 55,

    // });

    // doc.save("Form_1"  + ".pdf");
  }

  savePdf() {
    this.spinner.start();
    let data = document.getElementById('contentToConvert');
    html2canvas(data, { scale: 5, useCORS: true, allowTaint: true, scrollY: 0 }).then((canvas) => {
      const image = { type: 'png', quality: 100 };
      const margin = [0.5, 0.5];
      const filename = 'myfile.pdf';

      var imgWidth = 16.5;
      var pageHeight = 11.7;

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

      var pdf = new jsPDF('l', 'in', 'a3');
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

      pdf.save('Form_C' + '.pdf');
      this.spinner.stop();
    });
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.rows = [];
    this.display = false;

    let body = {
      userMasterID: this.User,
      orderBy: this.orderByValue
    };

    if (this.datefilter.value.branch == '') {
      this.branchAddress_display = false;
      this.companyAddress_display = true;
    }

    this.spinner.start();
    this.api
      .callApi(this.constant.GETADULTEMPLOYEES, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.filter = 'filter';
          this.rows = res.data;
          if (this.rows.length == 0) {
            this.display = true;
          }
          this.spinner.stop();
        }
      });
  }

  selectcompany(id) {
    this.display = false;
    this.branchAddress_display = true;
    this.companyAddress_display = false;
    this.companyData = [];
    this.User = [];
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.branch = res;
        this.spinner.stop();
      });
    this.api
      .callApi(this.constant.VIEWCOMPANYDATA + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.companyData = res.data;
          this.rows = [];
        }
      });

    this.spinner.start();
    let body = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.api
      .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          for (let item of res.data) {
            this.User.push(item.userMasterID);
          }
          // this.User = res.data;
          this.rows = [];
          this.spinner.stop();
        }
      });
  }

  selectBranch(id) {
    this.display = false;
    this.branchAddress_display = true;
    this.companyAddress_display = false;
    this.branch1 = [];
    this.User = [];
    this.api

      .callApi(this.constant.VIEWBRANCH + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.branch1 = res.data;
          this.rows = [];
        }
      });

    let bb = {
      branchMasterID: this.datefilter.value.branch,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          for (let item of res.data) {
            this.User.push(item.userMasterID);
          }
          // this.User = res.data;
          this.spinner.stop();
        }
      });
  }

  editimage(image) {
    this.image = image;
  }

  clear() {
    this.datefilter.resetForm();
    this.rows = [];
    this.branch1 = [];
    this.branch = [];
    this.companyData = [];
    this.display = false;
  }

  formatDate(value) {
    let date = new Date(value);
    const day = date.toLocaleString('default', { day: '2-digit' });
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.toLocaleString('default', { year: 'numeric' });

    return day + '-' + month + '-' + year;
  }
}
