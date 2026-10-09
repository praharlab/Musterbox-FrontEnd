import { Component, EventEmitter, OnInit, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ISidebar, SidebarService } from '../sidebar/sidebar.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import getMenu, { IMenuItem } from 'src/app/constants/menu';
import { environment } from 'src/environments/environment';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-pop-up-menu',
    templateUrl: './pop-up-menu.component.html',
    styleUrls: ['./pop-up-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PopUpMenuComponent implements OnInit {
  @ViewChild('lgModal', { static: false }) lgModal: ModalDirective;
  currentUser = null;
  subscription: Subscription;
  sidebar: ISidebar;
  searchVal: string = '';
  currentUrl: string;
  menuItems: IMenuItem[] = [];
  menuData: IMenuItem[] = [];
  selectedParentMenu = '';
  usertype: any;
  adminRoot = environment.adminRoot;
  recentMenu: IMenuItem[] = [];

  constructor(
      private router: Router,
      private sidebarService: SidebarService,
      private activatedRoute: ActivatedRoute,
      private authService: AuthService,
      private spinner: NgxUiLoaderService,
      private api: ApiService,
      private constant: ConstantService,
    ) {
      this.authService.getUser().then((user) => {
        this.currentUser = user;
      });
  
      this.subscription = this.sidebarService.getSidebar().subscribe(
        (res) => {
          this.sidebar = res;
        },
        (err) => {
          // console.error(`An error occurred: ${err.message}`);
        },
      );
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          map(() => this.activatedRoute),
          map((route) => {
            while (route.firstChild) {
              route = route.firstChild;
            }
            return route;
          }),
        )
        .subscribe((event) => {
          const path = this.router.url.split('?')[0];
          const paramtersLen = Object.keys(event.snapshot.params).length;
          const pathArr = path.split('/').slice(0, path.split('/').length - paramtersLen);
          this.currentUrl = pathArr.join('/');
        });
  
      router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          const { containerClassnames } = this.sidebar;
          this.selectMenu();
          // this.toggle();
          this.sidebarService.setContainerClassnames(
            0,
            containerClassnames,
            this.sidebar.selectedMenuHasSubItems,
          );
          window.scrollTo(0, 0);
        });
    }

  ngOnInit() {}

  selectMenu(): void {
    this.selectedParentMenu = this.findParentInPath(this.currentUrl) || '';
    this.isCurrentMenuHasSubItem();
  }

  findParentInPath(path): any {
    const foundedMenuItem = this.menuItems?.find((x) => x.to === path);
    if (!foundedMenuItem) {
      if (path.split('/').length > 1) {
        const pathArr = path.split('/');
        return this.findParentInPath(pathArr.slice(0, pathArr.length - 1).join('/'));
      } else {
        return undefined;
      }
    } else {
      return path;
    }
  }
  
  isCurrentMenuHasSubItem(): boolean {
    const { containerClassnames } = this.sidebar;

    const menuItem = this.menuItems?.find((x) => x.to === this.selectedParentMenu);
    const isCurrentMenuHasSubItem =
      menuItem && menuItem.subs && menuItem.subs.length > 0 ? true : false;
    if (isCurrentMenuHasSubItem !== this.sidebar.selectedMenuHasSubItems) {
      if (!isCurrentMenuHasSubItem) {
        this.sidebarService.setContainerClassnames(0, containerClassnames, false);
      } else {
        this.sidebarService.setContainerClassnames(0, containerClassnames, true);
      }
    }
    return isCurrentMenuHasSubItem;
  }

  getMenuClassesForResize(classes: string): string[] {
    let nextClasses = classes.split(' ').filter((x: string) => x !== '');
    const windowWidth = window.innerWidth;

    if (windowWidth < this.sidebarService.menuHiddenBreakpoint) {
      nextClasses.push('menu-mobile');
    } else if (windowWidth < this.sidebarService.subHiddenBreakpoint) {
      nextClasses = nextClasses.filter((x: string) => x !== 'menu-mobile');
      if (nextClasses.includes('menu-default') && !nextClasses.includes('menu-sub-hidden')) {
        nextClasses.push('menu-sub-hidden');
      }
    } else {
      nextClasses = nextClasses.filter((x: string) => x !== 'menu-mobile');
      if (nextClasses.includes('menu-default') && nextClasses.includes('menu-sub-hidden')) {
        nextClasses = nextClasses.filter((x: string) => x !== 'menu-sub-hidden');
      }
    }
    return nextClasses;
  }

  filteredMenuItems(menuItems: IMenuItem[]): IMenuItem[] {
    return menuItems
      ? menuItems.filter((x) => !x.roles || (x.roles && x.roles.includes(this.currentUser.role)))
      : [];
  }

  changeSelectedParentHasNoSubmenu(parentMenu: string): void {
    const { containerClassnames } = this.sidebar;
    this.selectedParentMenu = parentMenu;
    // this.viewingParentMenu = parentMenu;
    this.sidebarService.changeSelectedMenuHasSubItems(false);
    this.sidebarService.setContainerClassnames(0, containerClassnames, false);
  }

  openModal(){
    this.searchVal = ''
    this.menuItems = this.menuData;
    this.getMenuData()
    this.lgModal.show()
  }

  getIcon(html){
    return JSON.parse(html);
  }

  filterIcons(val: any){
    if(val.target.value == ''){
      this.menuItems = this.menuData;
    }else{
      this.menuItems = this.menuData.filter((x) => x.label.toLowerCase().includes(val.target.value.trim().toLowerCase()));
    }
  }

  addMenuClick(data) {
    let body = {
      userMasterID: localStorage.getItem('id'),
      formMasterID: data.formMasterID
    };

    this.api
      .callApi(this.constant.ADDMENUCLICK, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        this.getRecentMenus()
      });

  }
  
  getRecentMenus() {
    const userMasterID = localStorage.getItem('id');
    this.api
      .callApi(this.constant.GETRECENTMENUS + '/' + userMasterID, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          const data = res.data.map((x: any) => x.formMaster).filter((x) => this.menuData.some((y) => {
            if(y.menu == x.menu){
              x.icon = y.icon;
              x.label = y.label;
              x.to = y.to;
              return x;
            }
          }))

          this.recentMenu = data;
        }
        this.spinner.stop();

      });
  }

  getMenuData(){
    this.spinner.startLoader('popupmenu');
    // this.openModal()
    this.usertype = +localStorage.getItem('usertype');    
    if (this.usertype != 2 && this.usertype != 3 && this.usertype != 4) {
      let body = {
        userMasterID: localStorage.getItem('id'),
      };
      this.menuItems = getMenu();
      this.api
        .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            let formdata = res.data;
            this.spinner.stopLoader('popupmenu');

            let menu = this.menuItems
              .filter(menu => {
                if (menu.subs) {
                  menu.subs = menu.subs
                    .filter(menu1 => formdata.some(x => x.formName === menu1.menu))
                    .map(menu1 => {
                      let matchedForm = formdata.find(x => x.formName === menu1.menu);
                      return {
                        ...menu1,
                        formMasterID: matchedForm ? matchedForm.formMasterID : null
                      };
                    });
                }

                let matchedForm = formdata.find(x => x.formName === menu.menu);
                if (matchedForm) {
                  menu.formMasterID = matchedForm.formMasterID;
                }

                return !!matchedForm;
              });
            this.menuItems = menu;
            this.menuData = menu;
          }
        });
        
    } else {
      if (this.usertype == 2) {
        this.menuItems = [
          {
            icon: 'assets/menuIcons/dashboardIcon.svg',
            label: 'menu.dashboards',
            menu: 'VisitPurpose',
            to: `${this.adminRoot}/dashboards/default`,
          },
          {
            icon: 'assets/menuIcons/superAdminIcon.svg',
            label: 'Admin Menu',
            menu: 'Company',
            to: `${this.adminRoot}/superadminmenus`,
          },
        ];
        this.menuData = this.menuItems;
      } else if (this.usertype == 3) {
        this.menuItems = [
          {
            icon: 'assets/menuIcons/dashboardIcon.svg',
            label: 'menu.dashboards',
            menu: 'VisitPurpose',
            to: `${this.adminRoot}/dashboards/default`,
          },
          {
            icon: 'assets/menuIcons/companyIcon.svg',
            label: 'Company',
            menu: 'Company',
            to: `${this.adminRoot}/masters/company_master`,
            // roles: [UserRole.Admin],
          },
        ];
        this.menuData = this.menuItems;
      }
      else if (this.usertype == 4) {
        this.menuItems = [
          // {
          //   icon: 'assets/menuIcons/dashboardIcon.svg',
          //   label: 'menu.dashboards',
          //   menu: 'VisitPurpose',
          //   to: `${this.adminRoot}/dashboards/default`,
          // },
          {
            icon: 'assets/menuIcons/companyIcon.svg',
            label: 'Company',
            menu: 'Company',
            to: `${this.adminRoot}/masters/company_master`,
            // roles: [UserRole.Admin],
          },
        ];
        this.menuData = this.menuItems;
      }
    }

    this.spinner.stopLoader('popupmenu');

    setTimeout(() => {
      this.selectMenu();
      const { containerClassnames } = this.sidebar;
      const nextClasses = this.getMenuClassesForResize(containerClassnames);
      this.sidebarService.setContainerClassnames(
        0,
        nextClasses.join(' '),
        this.sidebar.selectedMenuHasSubItems,
      );
      this.isCurrentMenuHasSubItem();
    }, 100);
  }
}