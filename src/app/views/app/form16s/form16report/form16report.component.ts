import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as converter from 'number-to-words';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-form16report',
    templateUrl: './form16report.component.html',
    styleUrls: ['./form16report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Form16reportComponent implements OnInit {
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
  filterData = {
    page: 1,
    limit: 10,
    id: localStorage.getItem('company_id'),
  };
  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    id: localStorage.getItem('company_id'),
  };
  body1 = {
    page: 1,
    limit: 10,
    fromdate: '2021-01-11',
    todate: '2022-11-11',
    department: '28',
    company: '4',
    user: '13',
  };

  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  filter: any;
  export: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  usertype: any;
  company_id: any;
  alldepartment: any;
  company1: any;
  employee: any;
  image: any;
  enddate: Date;
  comp: any;
  alldesignation: any;
  finaldata: boolean = false;
  Qtax: any;

  //
  companyname: any = '';
  companyid: any;
  companyaddress: any = '';
  totalWord: any;

  pfAmount: any; //main
  admnac2: any;
  empac10: any;
  empac1: any;
  empactotal: any;
  empshareac1: any;

  ac1total: any;
  NoEmp: any; //Static
  monthName: any;
  pfno: any; //Static
  total: any;
  codeNo: void;
  users: any;
  assessmentYear: any = [
    '2015-16',
    '2016-17',
    '2017-18',
    '2018-19',
    '2019-20',
    '2020-21',
    '2021-22',
    '2022-23',
    '2023-24',
    '2024-25',
  ];
  userid: any;
  assessment_year: any;
  companyData: any;
  userData: any;
  userAddress: any;
  year: any;
  visible: boolean = false;
  Q1receipt: any;
  Q2receipt: any;
  Q3receipt: any;
  Q4receipt: any;
  Q1amountpaid: number = 0;
  Q2amountpaid: number = 0;
  Q3amountpaid: number = 0;
  Q4amountpaid: number = 0;
  Q1taxdeducted: number = 0;
  Q2taxdeducted: number = 0;
  Q3taxdeducted: number = 0;
  Q4taxdeducted: number = 0;
  Q1taxdeposited: number = 0;
  Q2taxdeposited: number = 0;
  Q3taxdeposited: number = 0;
  Q4taxdeposited: number = 0;
  Totalamountpaid: number = 0;
  Totaltaxdeducted: number = 0;
  Totaltaxdeposited: number = 0;
  TaxChallan: any;

  tax_challan: any = [];
  TotalTaxChallan: number = 0;
  userDesignation: any;
  userAddress1: any;
  dateTime: any;
  contentDataURL1: any;
  contentDataURL2: any;
  contentDataURL3: any;
  contentDataURL4: any;
  contentDataURL5: any;

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
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();

    const d = new Date();
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var dayName = days[d.getDay()];
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let month = months[d.getMonth()];
    const zone = String(String(d).split('(')[1])
      .split(')')[0]
      .replace(/[^A-Z]/g, '');
    this.dateTime = d.getDate() + '-' + month + '-' + d.getFullYear();
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.companyaddress = this.spinner.stop();
        }
      });
  }
  getuser(id1: any) {
    const filterData = {
      page: '',
      limit: '',
      companyMasterID: id1,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.users = res.data;
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (this.datefilter.valid) {
      
      this.assessment_year = this.datefilter.value.assessmentyear;
      this.userid = this.datefilter.value.user;
      this.companyid = this.datefilter.value.company;
      this.year = Number(this.assessment_year.substring(0, 4));


      let body = {
        id: this.companyid,
      };

      this.companyData = [];
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', false, true, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.companyData = res.data;

            this.spinner.stop();
          }
        });

      this.userData = [];
      this.spinner.start();
      this.api
        .callApi(this.constant.VIEWCOMPANYCONTACTDATA + this.userid, {}, 'GET', false, true, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.userData = res.data;

            this.spinner.stop();
          }
        });
      this.userAddress = [];
      this.spinner.start();
      this.api
        .callApi(this.constant.GETUSERADDRESS + this.userid, {}, 'GET', false, true, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.userAddress = res.data;
            //this.visible = true
            this.spinner.stop();
          }
        });

      let body1 = {
        userMasterID: this.userid,
        AssessmentYear: this.assessment_year,
      };

      this.Qtax = [];
      this.Q1receipt = '';
      this.Q2receipt = '';
      this.Q3receipt = '';
      this.Q4receipt = '';
      this.Q1amountpaid = 0;
      this.Q2amountpaid = 0;
      this.Q3amountpaid = 0;
      this.Q4amountpaid = 0;
      this.Q1taxdeducted = 0;
      this.Q2taxdeducted = 0;
      this.Q3taxdeducted = 0;
      this.Q4taxdeducted = 0;
      this.Q1taxdeposited = 0;
      this.Q2taxdeposited = 0;
      this.Q3taxdeposited = 0;
      this.Q4taxdeposited = 0;
      this.Totalamountpaid = 0;
      this.Totaltaxdeducted = 0;
      this.Totaltaxdeposited = 0;
      this.spinner.start();
      this.api
        .callApi(this.constant.GETBYIDQUATERTAXCHALLAN, body1, 'POST', false, true, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.Qtax = res.data;

            for (var i = 0; i < this.Qtax.length; i++) {
              if (this.Qtax[i].Quarters == 'Quater 1') {
                this.Q1receipt = this.Qtax[i].TDSReceipt;
                this.Q1amountpaid = Number(this.Qtax[i].EmpAmtCredited);
                this.Q1taxdeducted = Number(this.Qtax[i].EmpAmtTaxDeducted);
                this.Q1taxdeposited = Number(this.Qtax[i].EmpTaxDeposited);
              } else if (this.Qtax[i].Quarters == 'Quater 2') {
                this.Q2receipt = this.Qtax[i].TDSReceipt;
                this.Q2amountpaid = Number(this.Qtax[i].EmpAmtCredited);
                this.Q2taxdeducted = Number(this.Qtax[i].EmpAmtTaxDeducted);
                this.Q2taxdeposited = Number(this.Qtax[i].EmpTaxDeposited);
              } else if (this.Qtax[i].Quarters == 'Quater 3') {
                this.Q3receipt = this.Qtax[i].TDSReceipt;
                this.Q3amountpaid = Number(this.Qtax[i].EmpAmtCredited);
                this.Q3taxdeducted = Number(this.Qtax[i].EmpAmtTaxDeducted);
                this.Q3taxdeposited = Number(this.Qtax[i].EmpTaxDeposited);
              } else if (this.Qtax[i].Quarters == 'Quater 4') {
                this.Q4receipt = this.Qtax[i].TDSReceipt;
                this.Q4amountpaid = Number(this.Qtax[i].EmpAmtCredited);
                this.Q4taxdeducted = Number(this.Qtax[i].EmpAmtTaxDeducted);
                this.Q4taxdeposited = Number(this.Qtax[i].EmpTaxDeposited);
              }
            }

            this.Totalamountpaid =
              this.Q1amountpaid + this.Q2amountpaid + this.Q3amountpaid + this.Q4amountpaid;
            this.Totaltaxdeducted =
              this.Q1taxdeducted + this.Q2taxdeducted + this.Q3taxdeducted + this.Q4taxdeducted;
            this.Totaltaxdeposited =
              this.Q1taxdeposited + this.Q2taxdeposited + this.Q3taxdeposited + this.Q4taxdeposited;
            
            

            this.spinner.stop();
          }
        });

      this.getTaxChallan(this.userid, this.assessment_year);
      this.getDesignationAddresss();
    }
  }
  getDesignationAddresss() {
    this.userDesignation = [];
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETEMPLOYEEDESIGNATION + localStorage.getItem('id'),
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.userDesignation = res.data[0];
          

          this.spinner.stop();
        }
      });
    this.userAddress1 = [];
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETUSERADDRESS + localStorage.getItem('id'),
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.userAddress1 = res.data[0];
          this.visible = true;
          this.spinner.stop();
        }
      });
  }
  getTaxChallan(id, id1) {
    let body1 = {
      id: id,
      AssessmentYear: id1,
    };
    this.tax_challan = [];
    this.TotalTaxChallan = 0;
    this.spinner.start();
    this.api
      .callApi(this.constant.GETBYIDTAXCHALLAN1, body1, 'POST', false, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.TaxChallan = res.data;
          for (var i = 0; i < this.TaxChallan.length; i++) {
            let temp = {
              taxamount: this.TaxChallan[i].TaxDepositedAmt,
              bsrCode: this.TaxChallan[i].BSRCode,
              date: this.TaxChallan[i].TaxDepositedDate,
              SrNo: this.TaxChallan[i].SrNo,
              oltas: this.TaxChallan[i].Oltas,
              ChallanSerialNo: this.TaxChallan[i].ChallanSerialNo,
            };
            this.TotalTaxChallan =
              this.TotalTaxChallan + Number(this.TaxChallan[i].TaxDepositedAmt);
            this.tax_challan.push(temp);
          }
          this.spinner.stop();
        }
      });
  }
  // public SavePDF(): void {
  //   var data = document.getElementById('page3');
  //   html2canvas(data).then(canvas => {
  //     // Few necessary setting options
  //     var imgWidth = 90;
  //     var pageHeight = 295;
  //     var imgHeight = canvas.height * imgWidth / canvas.width;
  //     var heightLeft = imgHeight;
  //     var height = 270;
  //     var width = 190;

  //     const contentDataURL = canvas.toDataURL('image/png')
  //     let pdf = new jsPDF({
  //       orientation: "portrait",
  //       unit: "mm",
  //       format:'A4'
  //     });
  //     pdf.addImage(contentDataURL, 'PNG', 10, 10, width, height)
  //     pdf.save('Form16.pdf'); // Generated PDF
  //   });
  // }

  // public async SavePDF(): Promise<void> {
  //   var data = document.getElementById('page1');
  //   var data1 = document.getElementById('page2');
  //   let pdf = new jsPDF();
  //   let pdf1 = new jsPDF();
  //   let pdf2= new jsPDF();

  //   html2canvas(data).then(canvas => {
  //     // Few necessary setting options
  //     var imgWidth = 90;
  //     var pageHeight = 295;
  //     var imgHeight = canvas.height * imgWidth / canvas.width;
  //     var heightLeft = imgHeight;
  //     var height = 270;
  //     var width = 190;

  //     const contentDataURL = canvas.toDataURL('image/png')

  //     pdf.addImage(contentDataURL, 'PNG', 10, 10, width, height)
  //   });

  //   html2canvas(data1).then(canvas => {
  //     // Few necessary setting options
  //     var imgWidth = 90;
  //     var pageHeight = 295;
  //     var imgHeight = canvas.height * imgWidth / canvas.width;
  //     var heightLeft = imgHeight;
  //     var height = 270;
  //     var width = 190;

  //     const contentDataURL1 = canvas.toDataURL('image/png')

  //     pdf1.addImage(contentDataURL1, 'PNG', 10, 10, width, height)
  //   });

  //   //pdf2.addPage();
  //   pdf1.save('Form16.pdf'); // Generated PDF
  // }

  public SavePDF(): void {
    let pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'A4',
    });

    const input1 = document.getElementById('page1');
    const el1: HTMLElement = input1!;
    html2canvas(el1).then((canvas) => {
      // Few necessary setting options
      var imgWidth = 90;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      var height = 270;
      var width = 190;
      this.contentDataURL1 = canvas.toDataURL('image/png')!;
    });

    const input2 = document.getElementById('page2');
    const el2: HTMLElement = input2!;
    html2canvas(el2).then((canvas) => {
      // Few necessary setting options
      var imgWidth = 90;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      var height = 270;
      var width = 190;
      this.contentDataURL2 = canvas.toDataURL('image/png')!;
    });

    const input3 = document.getElementById('page3');
    const el3: HTMLElement = input3!;
    html2canvas(el3).then((canvas) => {
      // Few necessary setting options
      var imgWidth = 90;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      var height = 270;
      var width = 190;
      this.contentDataURL3 = canvas.toDataURL('image/png')!;
    });

    const input4 = document.getElementById('page4');
    const el4: HTMLElement = input4!;
    var data1 = document.getElementById('page4');
    html2canvas(el4).then((canvas) => {
      // Few necessary setting options
      var imgWidth = 90;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      var height = 270;
      var width = 190;
      this.contentDataURL4 = canvas.toDataURL('image/png')!;
    });

    const input5 = document.getElementById('page5');
    const el5: HTMLElement = input5!;
    var data1 = document.getElementById('page1');
    html2canvas(el5).then((canvas) => {
      // Few necessary setting options
      var imgWidth = 90;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      var height = 270;
      var width = 190;
      this.contentDataURL5 = canvas.toDataURL('image/png')!;
    });

    pdf.addImage(this.contentDataURL1, 'PNG', 10, 10, 190, 270);
    pdf.addPage();
    pdf.addImage(this.contentDataURL2, 'PNG', 10, 10, 190, 270);
    pdf.addPage();
    pdf.addImage(this.contentDataURL3, 'PNG', 10, 10, 190, 270);
    pdf.addPage();
    pdf.addImage(this.contentDataURL4, 'PNG', 10, 10, 190, 270);
    pdf.addPage();
    pdf.addImage(this.contentDataURL5, 'PNG', 10, 10, 190, 270);

    pdf.save('Form16.pdf');

    // Generated PDF
  }

  clear() {
    //this.visible=true
    window.location.reload();
  }
}
