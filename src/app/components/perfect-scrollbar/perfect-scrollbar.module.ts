/*
 * Local port of ngx-perfect-scrollbar 9.0.0 (MIT, https://github.com/zefoy/ngx-perfect-scrollbar).
 * The package was archived and only shipped in View Engine format, which cannot compile from
 * Angular 16 on. It wraps the framework-free `perfect-scrollbar` library; this port keeps the
 * same selectors, template, CSS, events and `directiveRef` scroll methods used in the app.
 * Scroll indicators / auto-propagation (unused here) were left out.
 */
import {
  Component,
  Directive,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  NgModule,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent, Subject } from 'rxjs';
import { auditTime, takeUntil } from 'rxjs/operators';
import PerfectScrollbar from 'perfect-scrollbar';

export type PerfectScrollbarConfigInterface = PerfectScrollbar.Options;

const PS_EVENTS = [
  'psScrollY',
  'psScrollX',
  'psScrollUp',
  'psScrollDown',
  'psScrollLeft',
  'psScrollRight',
  'psYReachEnd',
  'psYReachStart',
  'psXReachEnd',
  'psXReachStart',
] as const;

@Directive({
    selector: '[perfectScrollbar]',
    exportAs: 'ngxPerfectScrollbar',
    standalone: false
})
export class PerfectScrollbarDirective implements OnInit, DoCheck, OnDestroy {
  @Input('perfectScrollbar') config?: PerfectScrollbarConfigInterface;
  @Input() disabled = false;

  @Output() psScrollY = new EventEmitter<Event>();
  @Output() psScrollX = new EventEmitter<Event>();
  @Output() psScrollUp = new EventEmitter<Event>();
  @Output() psScrollDown = new EventEmitter<Event>();
  @Output() psScrollLeft = new EventEmitter<Event>();
  @Output() psScrollRight = new EventEmitter<Event>();
  @Output() psYReachEnd = new EventEmitter<Event>();
  @Output() psYReachStart = new EventEmitter<Event>();
  @Output() psXReachEnd = new EventEmitter<Event>();
  @Output() psXReachStart = new EventEmitter<Event>();

  private instance: PerfectScrollbar | null = null;
  private ro: ResizeObserver | null = null;
  private timeout: number | null = null;
  private animation: number | null = null;
  private configDiff: KeyValueDiffer<string, unknown> | null = null;
  private destroy$ = new Subject<void>();

  constructor(private zone: NgZone, private differs: KeyValueDiffers, private elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    if (this.disabled) {
      return;
    }
    const el = this.elementRef.nativeElement;
    this.zone.runOutsideAngular(() => {
      this.instance = new PerfectScrollbar(el, { ...(this.config || {}) });
      this.ro = new ResizeObserver(() => this.update());
      if (el.children[0]) {
        this.ro.observe(el.children[0]);
      }
      this.ro.observe(el);
      PS_EVENTS.forEach((name) => {
        const type = name.replace(/([A-Z])/g, (c) => `-${c.toLowerCase()}`);
        fromEvent<Event>(el, type)
          .pipe(auditTime(20), takeUntil(this.destroy$))
          .subscribe((event) => this.zone.run(() => this[name].emit(event)));
      });
    });
    if (!this.configDiff) {
      this.configDiff = this.differs.find(this.config || {}).create();
      this.configDiff.diff(this.configMap());
    }
  }

  ngDoCheck(): void {
    if (!this.disabled && this.configDiff && this.configDiff.diff(this.configMap())) {
      this.ngOnDestroy();
      this.destroy$ = new Subject<void>();
      this.ngOnInit();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.ro?.disconnect();
    this.ro = null;
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
    this.zone.runOutsideAngular(() => this.instance?.destroy());
    this.instance = null;
  }

  private configMap(): Record<string, unknown> {
    return (this.config || {}) as Record<string, unknown>;
  }

  ps(): PerfectScrollbar | null {
    return this.instance;
  }

  update(): void {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
    this.timeout = window.setTimeout(() => {
      if (!this.disabled) {
        this.zone.runOutsideAngular(() => this.instance?.update());
      }
    }, 0);
  }

  scrollTo(x: number, y?: number, speed?: number): void {
    if (this.disabled) {
      return;
    }
    if (y == null && speed == null) {
      this.animateScrolling('scrollTop', x, speed);
    } else {
      if (x != null) {
        this.animateScrolling('scrollLeft', x, speed);
      }
      if (y != null) {
        this.animateScrolling('scrollTop', y, speed);
      }
    }
  }

  scrollToX(x: number, speed?: number): void {
    this.animateScrolling('scrollLeft', x, speed);
  }

  scrollToY(y: number, speed?: number): void {
    this.animateScrolling('scrollTop', y, speed);
  }

  scrollToTop(offset?: number, speed?: number): void {
    this.animateScrolling('scrollTop', offset || 0, speed);
  }

  scrollToLeft(offset?: number, speed?: number): void {
    this.animateScrolling('scrollLeft', offset || 0, speed);
  }

  scrollToRight(offset?: number, speed?: number): void {
    const el = this.elementRef.nativeElement;
    this.animateScrolling('scrollLeft', el.scrollWidth - el.clientWidth - (offset || 0), speed);
  }

  scrollToBottom(offset?: number, speed?: number): void {
    const el = this.elementRef.nativeElement;
    this.animateScrolling('scrollTop', el.scrollHeight - el.clientHeight - (offset || 0), speed);
  }

  private animateScrolling(target: 'scrollTop' | 'scrollLeft', value: number, speed?: number): void {
    const el = this.elementRef.nativeElement;
    if (this.animation) {
      window.cancelAnimationFrame(this.animation);
      this.animation = null;
    }
    if (!speed) {
      el[target] = value;
      return;
    }
    if (value === el[target]) {
      return;
    }
    let scrollCount = 0;
    let oldTimestamp = performance.now();
    let oldValue = el[target];
    const cosParameter = (oldValue - value) / 2;
    const step = (newTimestamp: number) => {
      scrollCount += Math.PI / (speed / (newTimestamp - oldTimestamp));
      const newValue = Math.round(value + cosParameter + cosParameter * Math.cos(scrollCount));
      // only continue while nobody else moved the scroll position
      if (el[target] === oldValue) {
        if (scrollCount >= Math.PI) {
          this.animateScrolling(target, value, 0);
        } else {
          el[target] = newValue;
          oldValue = el[target];
          oldTimestamp = newTimestamp;
          this.animation = window.requestAnimationFrame(step);
        }
      }
    };
    window.requestAnimationFrame(step);
  }
}

@Component({
    selector: 'perfect-scrollbar',
    exportAs: 'ngxPerfectScrollbar',
    template: `<div
    style="position: static;"
    [class.ps]="usePSClass"
    [perfectScrollbar]="config"
    [disabled]="disabled"
    (psScrollY)="psScrollY.emit($event)"
    (psScrollX)="psScrollX.emit($event)"
    (psScrollUp)="psScrollUp.emit($event)"
    (psScrollDown)="psScrollDown.emit($event)"
    (psScrollLeft)="psScrollLeft.emit($event)"
    (psScrollRight)="psScrollRight.emit($event)"
    (psYReachEnd)="psYReachEnd.emit($event)"
    (psYReachStart)="psYReachStart.emit($event)"
    (psXReachEnd)="psXReachEnd.emit($event)"
    (psXReachStart)="psXReachStart.emit($event)"
  >
    <div class="ps-content"><ng-content></ng-content></div>
  </div>`,
    styleUrls: ['./perfect-scrollbar.component.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PerfectScrollbarComponent {
  @Input() config?: PerfectScrollbarConfigInterface;
  @Input() disabled = false;
  @Input() usePSClass = true;

  @Output() psScrollY = new EventEmitter<Event>();
  @Output() psScrollX = new EventEmitter<Event>();
  @Output() psScrollUp = new EventEmitter<Event>();
  @Output() psScrollDown = new EventEmitter<Event>();
  @Output() psScrollLeft = new EventEmitter<Event>();
  @Output() psScrollRight = new EventEmitter<Event>();
  @Output() psYReachEnd = new EventEmitter<Event>();
  @Output() psYReachStart = new EventEmitter<Event>();
  @Output() psXReachEnd = new EventEmitter<Event>();
  @Output() psXReachStart = new EventEmitter<Event>();

  @ViewChild(PerfectScrollbarDirective, { static: true }) directiveRef?: PerfectScrollbarDirective;
}

@NgModule({
  imports: [CommonModule],
  declarations: [PerfectScrollbarComponent, PerfectScrollbarDirective],
  exports: [CommonModule, PerfectScrollbarComponent, PerfectScrollbarDirective],
})
export class PerfectScrollbarModule {}
