import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivationEnd } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ChunkService } from 'src/app/services/chunk.service';

@Component({
    selector: 'app-tickets',
    templateUrl: './tickets.component.html',
    styleUrls: ['./tickets.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TicketsComponent implements OnInit {
  constructor(
    private router: Router,
    private spinner: NgxUiLoaderService,
    private chunkService: ChunkService,
  ) {
    router.events.subscribe((event) => {
      this.spinner.start('loader');
      if (event instanceof NavigationStart) {
        this.spinner.stop('loader');
        this.spinner.start('loader');
      } else if (event instanceof NavigationEnd) {
        this.spinner.stop('loader');
      }
    });
  }
  ngOnInit(): void {}
}
