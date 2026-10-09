import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment'

@Component({
    selector: 'app-import-show-shift-roster-data',
    templateUrl: './import-show-shift-roster-data.component.html',
    styleUrls: ['./import-show-shift-roster-data.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ImportShowShiftRosterDataComponent implements OnInit {
  @ViewChild('tableForm') tableForm: NgForm;

  @Input('permissioncreate') permissioncreate: any = [];
  @Input('permissionview') permissionview: any = [];
  @Input('rows') rows = [];
  @Input('dateRange') dateRange = [];
  @Input('allshift') allshift = [];
  @ViewChild('weekOffShuffleModal', { static: false }) weekOffShuffleModal: ModalDirective;
  @ViewChild('closeModal') closeModal: ElementRef;
  @Input('remarkCount') remarkCount: any;

  @Output() onSaveData: EventEmitter<void> = new EventEmitter();
  @Output() onRevalidateData: EventEmitter<any> = new EventEmitter();
  selectedUsers: any = [];
  currentData: any
  currentUserData: any
  @ViewChild('weekOffShuffleForm') weekOffShuffleForm: NgForm;

  showShuffle: any = 'true';
  showShuffleFields: any = 'true';
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,) { }

  ngOnInit(): void {
  }

  saveData() {
    if (!this.tableForm.valid) {
      return;
    }
    this.onSaveData.emit();
  }

  reValidateData() {
    if (!this.tableForm.valid) {
      return;
    }
    this.rows = this.rows.filter((row) => row.isDeleted == false)
    this.onRevalidateData.emit(this.rows);
  }
  removeRow(index: number) {
    this.rows[index].isDeleted = true;
  }
}
