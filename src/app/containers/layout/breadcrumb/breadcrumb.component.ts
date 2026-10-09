import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { Router, Event, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import getHeaderItems from 'src/app/constants/headerItems';
import { IHeaderItem } from 'src/app/constants/headerItems';
import { environment } from 'src/environments/environment';

export interface ICrumb {
  label: string;
  url: string;
  active: boolean;
}

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BreadcrumbComponent implements OnChanges {
  @Input() title = '';
  headerItems: IHeaderItem[] = [];

  path = '';
  pathArr: string[] = [];

  /* Rendered trail. Built once per navigation instead of being derived in the
     template, which previously ran two *ngFor loops over pathArr and toggled
     them with [hidden]. That emitted an <li> for every segment twice over, so
     unresolved segments showed as empty items (a stray "|") and the trailing
     item repeated the preceding label - e.g. "Dashboards | Admin Menu | Admin
     Menu". */
  crumbs: ICrumb[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.headerItems = getHeaderItems()
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        // Also build once on creation: since Angular 15 the page's NavigationEnd can
        // fire before this component (inside a lazily loaded page) is constructed,
        // which left the trail empty.
        startWith(null),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
      )
      .subscribe((event) => {
        this.path = this.router.url.slice(1, this.router.url.split('?')[0].length);
        const paramtersLen = Object.keys(event.snapshot.params).length;
        this.pathArr = this.path.split('/').slice(0, this.path.split('/').length - paramtersLen);
        this.buildCrumbs();
      });
  }

  ngOnChanges(): void {
    // `title` arrives as an @Input and can change after navigation.
    this.buildCrumbs();
  }

  private buildCrumbs(): void {
    const out: ICrumb[] = [];

    // Ancestors only. <app-heading> renders the current page name as an <h1>
    // immediately beside this trail on every screen that uses it, so including
    // the current page here showed the same words twice:
    //   "Dashboard"  +  "Dashboards | Dashboard"
    // Dropping the trailing entry leaves the h1 as the page title and the trail
    // purely as navigation back up the tree.
    const ancestors = this.pathArr.slice(0, -1);

    ancestors.forEach((sub) => {
      const label = this.getLabel(this.getUrl(sub));

      // skip segments that resolve to no label at all - these used to render as
      // empty <li>s, showing up as a stray separator
      if (!label) {
        return;
      }

      // collapse a repeat of the previous label rather than showing it twice
      const prev = out[out.length - 1];
      if (prev && prev.label === label) {
        return;
      }

      out.push({ label, url: this.getUrl(sub), active: false });
    });

    this.crumbs = out;
  }

  getUrl = (sub: string) => {
    if (sub == 'app') {
      if (localStorage.getItem('usertype') == '2' || localStorage.getItem('usertype') == '3') {
        return `${environment.adminRoot}/dashboards/default`;
      } else {
        return `${environment.adminRoot}/dashboards/analytics`;
      }
    } else {
      return '/' + this.path.split(sub)[0] + sub;
    }
  };

  getLabel(path): string {
    if (path === environment.adminRoot) {
      return 'menu.home';
    }

    // step 0
    let foundedMenuItem = this.headerItems.find((x) => x.to === path);

    if (!foundedMenuItem) {
      // step 1
      this.headerItems.map((menu) => {
        if (!foundedMenuItem && menu.subs) {
          foundedMenuItem = menu.subs.find((x) => x.to === path);
        }
      });
      if (!foundedMenuItem) {
        // step 2
        this.headerItems.map((menu) => {
          if (menu.subs) {
            menu.subs.map((sub) => {
              if (!foundedMenuItem && sub.subs) {
                foundedMenuItem = sub.subs.find((x) => x.to === path);
              }
            });
          }
        });
        if (!foundedMenuItem) {
          // step 3
          this.headerItems.map((menu) => {
            if (menu.subs) {
              menu.subs.map((sub) => {
                if (sub.subs) {
                  sub.subs.map((deepSub) => {
                    if (!foundedMenuItem && deepSub.subs) {
                      foundedMenuItem = deepSub.subs.find((x) => x.to === path);
                    }
                  });
                }
              });
            }
          });
        }
      }
    }

    if (foundedMenuItem) {
      return foundedMenuItem.label;
    } else {
      return '';
    }
  }
}
