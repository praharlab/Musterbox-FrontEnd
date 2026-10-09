import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
declare var require: any;
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-form21',
    templateUrl: './form21.component.html',
    styleUrls: ['./form21.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Form21Component implements OnInit {
  spinner: any;
  src = '../../../../assets/Form21.pdf';
  constructor() {}

  ngOnInit(): void {}
  savePdf() {
    saveAs(this.src, 'form21.pdf');
  }
}
