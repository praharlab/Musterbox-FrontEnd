import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-add-goal-review-request',
    templateUrl: './add-goal-review-request.component.html',
    styleUrls: ['./add-goal-review-request.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddGoalReviewRequestComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
