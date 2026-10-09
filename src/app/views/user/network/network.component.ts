import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-network',
    templateUrl: './network.component.html',
    styleUrls: ['./network.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NetworkComponent implements OnInit {
  network: any;

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.network = localStorage.getItem('network');
    if (this.network == null) {
      this.router.navigate(['']);
    }
  }

  public reload() {
    window.location.reload();
  }
}
