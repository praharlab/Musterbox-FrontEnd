import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-user-modal',
    templateUrl: './user-modal.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UserModalComponent implements OnInit {
  pageYPosition: any;
  pageXPosition: any;
  userMasterID: any;
  rows: any = [];
  displayName: any;
  userNumber: any;
  photo: any;
  department: any;
  apiURL = environment.apiUrl;
  imgshow1: boolean;
  designation: any;
  companyName: any;
  email: any;
  branch: any;
  show: Boolean = false;

  @Input()
  set pagex(pagex: number) {
    this.pageXPosition = pagex;
  }

  @Input()
  set pagey(pagey: number) {
    this.pageYPosition = pagey;
  }

  @Input()
  set masterId(masterId: number) {
    this.userMasterID = masterId;
  }

  @Output() myEvent = new EventEmitter<boolean>();

  htmlelement;

  constructor(
    private api: ApiService,
    private constant: ConstantService,
  ) {}

  onButtonClick() {
    this.myEvent.emit(false);
  }

  ngOnInit() {
    this.htmlelement = document.querySelector('.content');
    this.htmlelement.style.top = this.pageYPosition;
    this.htmlelement.style.left = this.pageXPosition;
    this.htmlelement.style.visibility = 'hidden';
    this.rows = [];

    this.api.showLoader(true);
    this.api
      .callApi(this.constant.PROFILEINFO + this.userMasterID, {}, 'GET', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.displayName = this.rows.name;
          this.userNumber = this.rows.userNumber;
          this.photo = this.rows.profile;
          this.designation = this.rows.designation;
          this.companyName = this.rows.companyName;
          this.email = this.rows.email;
          this.branch = this.rows.branch;
          this.department = this.rows.department;
          if (this.photo != '' && this.photo != null) {
            var img = new Image();
            img.src = this.photo;
            if (img.complete) {
              this.imgshow1 = true;
              this.show = !this.show;
              this.htmlelement.style.visibility = 'visible';
            } else {
              img.onload = () => {
                this.imgshow1 = true;
                this.show = !this.show;
                this.htmlelement.style.visibility = 'visible';
              };
              img.onerror = () => {
                this.imgshow1 = false;
              };
            }
          } else {
            this.imgshow1 = false;
            this.show = !this.show;
            this.htmlelement.style.visibility = 'visible';
          }
          this.api.dismissLoader();
        }
      });
  }
}
