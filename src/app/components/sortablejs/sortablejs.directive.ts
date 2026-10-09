import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import Sortable from 'sortablejs';

/**
 * Drop-in replacement for ngx-sortablejs (View Engine only, breaks at Angular 16).
 * Same inputs: `[sortablejs]` (the bound list, kept for template compatibility) and
 * `[sortablejsOptions]` (passed straight to Sortable.create).
 */
@Directive({
    selector: '[sortablejs]',
    standalone: false
})
export class SortablejsDirective implements OnInit, OnDestroy {
  @Input() sortablejs: unknown[];
  @Input() sortablejsOptions: Sortable.Options = {};

  private sortable: Sortable;

  constructor(private el: ElementRef<HTMLElement>, private zone: NgZone) {}

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.sortable = Sortable.create(this.el.nativeElement, this.sortablejsOptions);
    });
  }

  ngOnDestroy(): void {
    this.sortable?.destroy();
  }
}
