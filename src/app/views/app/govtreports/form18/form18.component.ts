import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
    selector: 'app-form18',
    templateUrl: './form18.component.html',
    styleUrls: ['./form18.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Form18Component implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('content', { static: false }) content: ElementRef;
  comp: any;
  companyaddress: any;
  scrollBarHorizontal: boolean;
  finaldata: boolean = false;
  branch: any;
  usertype: string;
  company_id: string;
  company1: any;
  designation1: any;
  alldepartment: any;
  selected1: any;
  selected: any;
  selected2: any;
  selected3: any;
  empList: any;
  pdf: any;
  year = [];

  body = {
    companyMasterID: '',
    yearMonth: '',
    userid: '',
    branchid: '',
    departmentid: '',
    designationid: '',
  };
  allbranch: any;
  form18: any;
  permissionview: any;

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

  ngOnInit(): void {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.getYear();
    this.checkpermission();
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
              permissionval.formName == 'Form-18' && permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  SavePDF() {
    // var height = document.getElementById('content').offsetHeight;
    // alert(height);
    // let printContents, popupWin;
    let printContents = document.getElementById('content');

    html2canvas(printContents, { scale: 3, useCORS: true, allowTaint: true, scrollY: 0 }).then(
      (canvas) => {
        const image = { type: 'png', quality: 100 };
        const margin = [1, 1];
        const filename = 'myfile.pdf';

        var imgWidth = 16.5;
        var pageHeight = 11.7;

        var innerPageWidth = imgWidth - margin[0] * 2;
        var innerPageHeight = pageHeight - margin[1] * 2;

        var pxFullHeight = canvas.height;
        var pxPageHeight = Math.floor(canvas.width * (pageHeight / imgWidth) + 400);
        var nPages = Math.ceil(pxFullHeight / pxPageHeight);

        var pageHeight = innerPageHeight;

        var pageCanvas = document.createElement('canvas');
        var pageCtx = pageCanvas.getContext('2d');
        pageCanvas.width = canvas.width;
        pageCanvas.height = pxPageHeight;

        this.pdf = new jsPDF('l', 'in', 'a3');
        // pdf.internal.scaleFactor = 30;
        for (var page = 0; page < nPages; page++) {
          if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
            pageCanvas.height = pxFullHeight % pxPageHeight;
            pageHeight = (pageCanvas.height * innerPageWidth) / pageCanvas.width;
          }

          var w = pageCanvas.width;
          var h = pageCanvas.height;
          pageCtx.fillStyle = 'gray';

          pageCtx.fillRect(0, 0, w, h);

          pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);

          if (page > 0) this.pdf.addPage();
          var imgData = pageCanvas.toDataURL('image/png' + image.type, image.quality);
          this.pdf.addImage(
            imgData,
            image.type,
            margin[1],
            margin[0],
            innerPageWidth,
            pageHeight,
            '',
            'SLOW',
          );
        }

        this.pdf.save('Form_18' + '.pdf');
        this.spinner.stop();
      },
    );
  }

  getYear() {
    this.year = [];
    for (var i = 0; i < 50; i++) {
      let currentYear = new Date().getFullYear();

      let previousYears = currentYear - i;
      this.year.push(previousYears);
    }
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

  selectcompany(id) {
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;

        this.selectAllForDropdownItems(this.allbranch);
        let data1 = [];
        this.allbranch.forEach(async (rating) => {
          data1.push(rating.branchMasterID);
        });
        this.selected3 = data1;
      });

    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.designation1 = res.data;
          this.selectAllForDropdownItems(this.designation1);
          let data = [];
          this.designation1.forEach(async (rating) => {
            data.push(rating.designationId);
          });
          this.selected1 = data;
        }
      });
    this.api
      .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldepartment = res.data;
          this.selectAllForDropdownItems(this.alldepartment);
          let data1 = [];
          this.alldepartment.forEach(async (rating) => {
            data1.push(rating.departmentId);
          });
          this.selected2 = data1;
        }
      });

    const filterData = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.empList = res.data;
          this.selectAllForDropdownItems(this.empList);
          this.empList.map((el) => {
            el.name = el.firstName + ' ' + el.lastName;
          });

          let data1 = [];
          this.empList.forEach(async (rating) => {
            data1.push(rating.userMasterID);
          });
          this.selected = data1;
        }
      });
  }
  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  onSubmit() {
    // this.body.companyMasterID = this.datefilter.value.company;
    // this.body.yearMonth = this.datefilter.value.fromdate;
    // if (this.selected) {
    //   this.body.userid = this.selected;
    // }
    // else {
    //   this.body.userid = ''
    // }
    // if (this.selected3) {
    //   this.body.branchid = this.selected3;
    // } else {
    //   this.body.branchid = ''
    // }
    // if (this.selected2) {
    //   this.body.departmentid = this.selected2;
    // } else {
    //   this.body.departmentid = ''
    // }
    // if (this.selected1) {
    //   this.body.designationid = this.selected1
    // } else {
    //   this.body.designationid = ''
    // }

    let finaldepartment: any;
    let finaldesignation: any;
    let finalbranch: any;
    let finaluser: any;

    if (this.datefilter.value.department == '') {
      finaldepartment = this.selected2;
    } else {
      finaldepartment = this.datefilter.value.department;
    }

    if (this.datefilter.value.designation == '') {
      finaldesignation = this.selected1;
    } else {
      finaldesignation = this.datefilter.value.designation;
    }

    if (this.datefilter.value.branch == '') {
      finalbranch = this.selected3;
    } else {
      finalbranch = this.datefilter.value.branch;
    }

    if (this.datefilter.value.employee == '') {
      finaluser = this.selected;
    } else {
      finaluser = this.datefilter.value.employee;
    }

    const body = {
      companyMasterID: this.datefilter.value.company,
      yearMonth: this.datefilter.value.fromdate,
      departmentid: finaldepartment,
      designationid: finaldesignation,
      userMasterID: finaluser,
      branchMasterID: finalbranch,
    };
    if (this.datefilter.value.fromdate) {
      this.api
        .callApi(this.constant.GETFORM18, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.form18 = res.data;
          }
        });
      this.finaldata = true;
    }
  }

  clear() {
    this.datefilter.resetForm();
    setTimeout(() => {
      this.ngOnInit();
      this.form18 = [];
    }, 100);
  }
}
