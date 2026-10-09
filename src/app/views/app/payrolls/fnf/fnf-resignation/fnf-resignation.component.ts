import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-fnf-resignation',
    templateUrl: './fnf-resignation.component.html',
    styleUrls: ['./fnf-resignation.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FnfResignationComponent implements OnInit {
  apiURL = environment.apiUrl;
  applicationData: any
  referenceData: any;
  employeeComment: any;
  resignationTaskData: any = [];
  showloader: boolean = false
  userMasterID: any;
  showDataModalRef: BsModalRef | null;
  viewTaskModalRef: BsModalRef | null;
  @Output('isResignationCompleted') isResignationCompleted = new EventEmitter<boolean>();
  @Output('reloadResignation') reloadResignation = new EventEmitter<any>();
  @ViewChild('closeModal') closeModal: ElementRef;

  constructor(
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {

  }

  ResignationApplications() {
    this.showloader = true
    this.api
      .callApi(
        this.constant.APPROVEDRESIGNATION + this.userMasterID,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.applicationData = res.data;
          if (this.applicationData) {
            if (this.applicationData.authorizationstatus == 3) {
              this.isResignationCompleted.emit(true)
            } else {
              this.isResignationCompleted.emit(false)

            }

          } else {
            this.isResignationCompleted.emit(true)
          }
          this.showloader = false
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.showloader = false
        },
      );
  }

  viewDocument(attachment) {
    window.open(`${this.apiURL}uploads/resignation/${attachment}`, '_blank');
  }


  showData(id: any, template: TemplateRef<any>) {
    this.referenceData = null;
    this.showloader = true
    this.api
      .callApi(this.constant.GETRESIGNATIONBYREFERENCEID + id, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.referenceData = res.data;
            this.employeeComment = this.referenceData.employeeComment;

            var s = this.referenceData.employeeComment ? this.referenceData.employeeComment : '';
            var htmlObject = document.getElementById('employeeComment');
            if (htmlObject) {
              htmlObject.innerHTML = s;
            }
            this.showloader = false
            this.showDataModalRef = this.modalService.show(template)

          } else {
            this.commonNotificationService.handleError(res.message);
            this.showloader = false

          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.showloader = false
        },
      );
  }

  showResignationTask(id: any, template: TemplateRef<any>) {
    this.resignationTaskData = [];
    this.showloader = true
    this.api
      .callApi(this.constant.GETRESIGNATIONTASKBYID + id, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.resignationTaskData = res.data;
            this.viewTaskModalRef = this.modalService.show(template, { class: 'modal-lg' })
            this.showloader = false
          } else {
            this.showloader = false
          }
        },
        (err) => {
          this.showloader = false
          this.commonNotificationService.handleError(err.error.message);
        },
      );
  }

  closeShowModalFunction() {
    this.showDataModalRef.hide()
  }

  closeViewModalFunction() {
    this.viewTaskModalRef.hide()
  }
}
