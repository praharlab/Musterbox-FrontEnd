import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-state-button',
    templateUrl: './state-button.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class StateButtonComponent {
  @Input() currentState = ''; // show-spinner | show-success | show-fail
  @Input() message = '';
  @Input() showMessage = false;
  @Input() isDisabled = false;
  @Input() btnClass = 'btn';
  constructor() {}
}
