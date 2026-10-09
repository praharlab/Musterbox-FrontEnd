import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router, Event, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import getHeaderItems from 'src/app/constants/headerItems';
import headerItems, { IHeaderItem } from 'src/app/constants/headerItems';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-heading',
    templateUrl: './heading.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HeadingComponent {
  @Input() title = '';
  headerItems: IHeaderItem[] = [];
  path = '';
  pathArr: string[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.headerItems = getHeaderItems();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        // Also resolve once on creation: the page's NavigationEnd can fire before this
        // component (inside a lazily loaded page) exists, which left the title empty.
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
        this.path = this.router.url.split('?')[0];

        const paramtersLen = Object.keys(event.snapshot.params).length;
        this.pathArr = this.path.split('/').slice(0, this.path.split('/').length - paramtersLen);
      });
  }

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
