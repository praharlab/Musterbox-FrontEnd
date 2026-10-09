import { Component, EventEmitter, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-fnf-user-details',
    templateUrl: './fnf-user-details.component.html',
    styleUrls: ['./fnf-user-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FnfUserDetailsComponent implements OnInit {

  @Output('getUser') getUser = new EventEmitter<any>();

  showloader: boolean = false;
  body: {
    userMasterID: any,
    companyId: number | null,
    month: string
  } = {
    userMasterID : null,
    companyId: null,
    month: ''
  }  

  apiURL= environment.apiUrl;

  userData: any = {}

  constructor(private constant: ConstantService, private api: ApiService) { }

  ngOnInit(): void {}

  getUserData(){
    this.showloader = true;
    this.api
    .callApi(this.constant.LISTFNFEMPLOYEES, this.body, 'POST', true, false, true)
    .subscribe((res: any) => {
      if (res.status == 200) {
        this.userData = res.data[0];
        if(this.userData)
          this.getUser.emit(this.userData)
      }
      this.showloader = false;
    }, (err) => {
      this.showloader = false;
    });
  }

}
