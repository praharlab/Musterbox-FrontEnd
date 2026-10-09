
import { Component, ViewChild, OnInit, ElementRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { CommonNotificationService } from 'src/app/services/common-notification.service';

@Component({
    selector: 'app-fnf-generate-experience-letter',
    templateUrl: './fnf-generate-experience-letter.component.html',
    styleUrls: ['./fnf-generate-experience-letter.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FnfGenerateExperienceLetterComponent implements OnInit {
  @ViewChild('generateLetter') generateLetter: NgForm;
  @ViewChild('closeModalE') closeModalE: ElementRef;
  @ViewChild('lgModal', { static: false }) lgModal: ModalDirective;
  apiURL = environment.apiUrl;
  allExperienceletter: any;
  experienceLetterData: any
  userData: any;
  body = {
    companyMasterID: null,
    userMasterID: null
  };
  showloader: boolean = false
  @Output('reloadExpLetter') reloadExpLetter = new EventEmitter<any>();
  @Output('isExperienceLetter') isExperienceLetter = new EventEmitter<any>();


  constructor(
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
  ) {
    
  }

  ngOnInit(): void {
  }

  view(path: any) {
    window.open(this.apiURL + 'uploads/letter/' + path, '_blank');
  }

  sendmail() {
    let body = {
      companyMasterID: this.body.companyMasterID,
      userMasterID: this.body.userMasterID,
    };

    this.showloader = true;
    this.api
      .callApi(this.constant.EXPERIENCEMAIL, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message)
        }
        else {
          this.commonNotificationService.handleWarning(res.message)
          this.showloader = false;
        }
        this.showloader = false;
      }, (err) => {
        this.commonNotificationService.handleError(err.error.message)
        this.showloader = false;
      });

  }

  generate() {
    this.getAllExpLetter()
    this.lgModal.show()
  }

  getAllExpLetter() {
    const filterData = {
      companyMasterID: this.body.companyMasterID,
    };
    this.showloader = true;
    this.api
      .callApi(this.constant.GETEXPEROENCELETTER, filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.allExperienceletter = res.data;
          }
          this.showloader = false;
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message)
          this.showloader = false;
        },
      );
  }

  onSubmit() {
    if (!this.generateLetter.valid) {
      return;
    }
    let body = {
      userMasterID: this.body.userMasterID,
      lettertype: 'experienceletter',
      experienceLetterID: this.generateLetter.value.experienceLetterList,
    };
    this.showloader = true;
    this.api
      .callApi(this.constant.ADDLETTERS, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message)
          this.reloadExpLetter.emit()
          this.closeModalE.nativeElement.click();
          this.generateLetter.resetForm();
          this.showloader = false;
        } else {
          this.commonNotificationService.handleError(res.message)
          this.showloader = false;
        }
      });

  }

  allLetterData() {
    let body1 = {
      userMasterID: this.body.userMasterID,
    };

    this.showloader = true;

    this.api.callApi(this.constant.GETALLLETTERS, body1, 'POST', true, false, true).subscribe((res: any) => {
      if (res.status === 200) {
        this.experienceLetterData = res.data.find((e) => e.label == 'Experience Letter');
        this.isExperienceLetter.emit(this.experienceLetterData && this.experienceLetterData.path  && this.userData.isFNF ? true : false)
      } else {
        console.error("GETALLLETTERS API CALL FAILED:", res.message);
      }
      this.showloader = false;
    }, (error) => {
      console.error("Error in GETALLLETTERS API call", error);
      this.showloader = false;
    });
  }

  allUserData() {
    this.showloader = true;
    this.api
      .callApi(this.constant.VIEWCOMPANYCONTACTDATA + this.body.userMasterID, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.showloader = false;
          this.userData = res.data;
          this.allLetterData()
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message)
          this.showloader = false;
        },
      );
  }
}
