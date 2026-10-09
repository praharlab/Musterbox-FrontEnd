import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from '../services/api.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-session-time-out',
    templateUrl: './session-time-out.component.html',
    styleUrls: ['./session-time-out.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SessionTimeOutComponent implements OnInit {
  @ViewChild('showClick') showClick: ElementRef;
  @ViewChild('lgModal') lgModal: ModalDirective;

  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  isModalOpen = false;

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.apiService.getRefreshSessionTimeOutObservable().subscribe(() => {
      if (!this.isModalOpen) {
        this.showClick.nativeElement.click();
        this.isModalOpen = true; // Set to true once the modal is opened
      }
    });
  }

  openModal(): void {
    this.lgModal.show();
  }

  redirect() {
    this.lgModal.hide()
    localStorage.clear();
    window.open(environment.appLoginUrl);
    window.location.reload();
  }
}
