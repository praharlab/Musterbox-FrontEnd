import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-radial-process-card',
    templateUrl: './radial-process-card.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class RadialProcessCardComponent {
  @Input() title = 'title';
  @Input() isSortable = false;
  @Input() class = '';
  status: any;

  @Input()
  set percent(value: any) {
    if (value !== undefined) {
      this.status = value;
    }
  }
}
