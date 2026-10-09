import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-permission-view',
    templateUrl: './permission-view.component.html',
    styleUrls: ['./permission-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PermissionViewComponent implements OnInit, OnChanges {
  @Input() formdata: any[] = [];
  @Input() action: string = "";
  myData = [];
  myAction = "";

  @Output() parentform = new EventEmitter<any>();
  @Output() childform = new EventEmitter<any>();
  @Output() operations = new EventEmitter<any>();

  ngOnChanges() {
    this.myData = this.formdata;
    this.myAction = this.action;
  }

  emitParentForm(form: any, checked: boolean) {
    this.parentform.emit({ form, checked });
  }

  emitChildForm(child: any, checked: boolean) {
    this.childform.emit({ child, checked });
  }

  emitOperation(parent: any, child: any, operation: any, checked: boolean) {
    this.operations.emit({ parent, child, operation, checked });
  }
  constructor() {
  }

  ngOnInit(): void {
  }

  trackByFormId(index: number, item: any): any {
    return item.formMasterID;
  }
}
