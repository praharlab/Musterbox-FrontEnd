import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-quater-tax-challan',
    templateUrl: './list-quater-tax-challan.component.html',
    styleUrls: ['./list-quater-tax-challan.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListQuaterTaxChallanComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  columns = [
    { name: 'Id', prop: 'shiftID' },
    { name: 'Company Name', prop: 'companyTypename' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    id: 4,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  rows1: any = [];
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];

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
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLQUATERTAXCHALLAN, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;


          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Shift' && permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Shift' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Shift' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Shift' && permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  updateFilter(event): void {
    const val = event.target.value.toLowerCase().trim();
    const count = this.columns.length;
    const keys = Object.keys(this.temp[0]);
    const temp = this.temp.filter((item) => {
      for (let i = 0; i < count; i++) {
        if ((item[keys[i]] && item[keys[i]].toString().toLowerCase().indexOf(val) !== -1) || !val) {
          return true;
        }
      }
    });
    this.rows = temp;
    this.table.offset = 0;
  }

  onSelect({ selected }): void {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.setSelectAllState();
  }

  setSelectAllState(): void {
    if (this.selected.length === this.rows.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.rows];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }

  // onItemsPerPageChange(itemCount): void {
  //   this.itemsPerPage = itemCount;
  // }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.ngOnInit();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.ngOnInit();
  }
  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/form16s/add_quater_tax_challan']);
  }
  alertConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          QuarterTaxChallanID: id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEQUATERTAXCHALLAN, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.ngOnInit();
              this.spinner.stop();
            },
            (err) => {
              console.log('error', err);
              this.spinner.stop();
            },
          );
      }
    });
  }
  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          QuarterTaxChallanID: id,
          Status: '0',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.QUATERTAXCHALLANSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.ngOnInit();
              this.spinner.stop();
            },
            (err) => {
              console.log('error', err);
              this.spinner.stop();
            },
          );
      }
    });
  }
  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          QuarterTaxChallanID: id,
          Status: '1',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.QUATERTAXCHALLANSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.ngOnInit();
              this.spinner.stop();
            },
            (err) => {
              console.log('error', err);
              this.spinner.stop();
            },
          );
      }
    });
  }
  //   downloadFile() {
  //     let data=[];
  //     const data2 = {
  //       page: "",
  //       limit: "",
  //     };

  //     this.api.callApi(
  //       this.constant.GETBANKDATA,
  //       data2,
  //       "POST",
  //       true,
  //       false,
  //       true
  //     ).subscribe((res: any) => {

  //       if (res.status == 200) {

  //         this.rows1=res.data;

  //         this.temp = [...this.rows1];

  //         for(var i=0;i<this.rows1.length;i++)
  //     {

  //       const data1={
  //         bankId:this.rows1[i].shiftID,
  //         bankName:this.rows1[i].bankName,
  //         status:this.rows1[i].status,
  //         createdAt:this.rows1[i].createdAt,
  //         updatedAt:this.rows1[i].updatedAt,
  //       }
  //       if(data1.status==1)
  //       {
  //         data1.status='Active';
  //       }
  //       else
  //       {
  //         data1.status='Deactive';
  //       }
  //       data.push(data1);

  //     }

  //     const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
  //     const header = Object.keys(data[0]);
  //     let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
  //     csv.unshift(header.join(','));
  //     let csvArray = csv.join('\r\n');

  //     var blob = new Blob([csvArray], {type: 'text/csv' })
  //     saveAs(blob, "bank.csv");
  //       }

  //     } )

  // }
}
