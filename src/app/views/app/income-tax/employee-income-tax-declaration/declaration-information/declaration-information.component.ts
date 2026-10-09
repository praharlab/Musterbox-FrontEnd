import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-declaration-information',
    templateUrl: './declaration-information.component.html',
    styleUrls: ['./declaration-information.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DeclarationInformationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
