import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ErrorComponent implements OnInit, OnDestroy {
  adminRoot = environment.adminRoot;

  constructor() {}

  ngOnInit(): void {
    document.body.classList.add('background');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('background');
  }
}
