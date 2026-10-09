import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivationEnd } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ChunkService } from 'src/app/services/chunk.service';
import { FilterStatusService } from 'src/app/services/filter-status.service';

@Component({
    selector: 'app-masters',
    templateUrl: './masters.component.html',
    styleUrls: ['./masters.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MastersComponent implements OnInit {
  constructor(
    private router: Router,
    private spinner: NgxUiLoaderService,
    private chunkService: ChunkService,
    private filterService: FilterStatusService,
  ) {
    router.events.subscribe((event) => {
      spinner.start('loader');
      if (event instanceof NavigationStart) {
        spinner.stop('loader');
        spinner.start('loader');
        // this.spinner.start('master');
        if (event.url != '/app/masters/employee' && !event.url.includes('/app/masters/edit_employee')) filterService.clearFilterData();

      } else if (event instanceof NavigationEnd) {
        spinner.stop('loader');
        // this.spinner.stop('master');
        if (event.url != '/app/masters/employee' && !event.url.includes('/app/masters/edit_employee')) filterService.clearFilterData();

      }else{
        spinner.stop('loader');
      }

    });
  }
  ngOnInit(): void { }
}
