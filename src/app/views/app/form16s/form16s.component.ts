import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivationEnd } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ChunkService } from 'src/app/services/chunk.service';

@Component({
    selector: 'app-form16s',
    templateUrl: './form16s.component.html',
    styleUrls: ['./form16s.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Form16sComponent implements OnInit {
  constructor(
    private router: Router,
    private spinner: NgxUiLoaderService,
    private chunkService: ChunkService,
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.spinner.start('loader');
      } else if (event instanceof NavigationEnd) {
        this.spinner.stop('loader');
      }
    });
  }
  ngOnInit(): void {}
}
