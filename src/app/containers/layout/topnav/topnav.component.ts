import { Component, OnInit, OnDestroy, HostListener, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidebarService, ISidebar } from '../sidebar/sidebar.service';
import { LangService, Language } from 'src/app/shared/lang.service';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';
import { getThemeColor, setThemeColor } from 'src/app/utils/util';
import { ConstantService } from 'src/app/services/constant.service';
import { ApiService } from 'src/app/services/api.service';
import { image } from 'html2canvas/dist/types/css/types/image';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatNotificationCountService } from 'src/app/services/chat-notification-count.service';
import { CompanyLogoService } from '../../../services/company-logo.service';
import { PopUpMenuComponent } from '../pop-up-menu/pop-up-menu.component';

@Component({
    selector: 'app-topnav',
    templateUrl: './topnav.component.html',
    styleUrls: ['./topnav.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TopnavComponent implements OnInit, OnDestroy {
  @ViewChild(PopUpMenuComponent) popUp: PopUpMenuComponent;
  buyUrl = environment.buyUrl;
  adminRoot = environment.adminRoot;
  sidebar: ISidebar;
  subscription: Subscription;
  displayName = 'Sarah Cortney';
  languages: Language[];
  currentLanguage: string;
  isSingleLang;
  isFullScreen = false;
  isDarkModeActive = false;
  searchKey = '';
  companydata: any = {};
  userdata: any = {};
  apiURL = environment.apiUrl;
  imgshow: boolean;
  imgshow1: boolean;
  isNotification = false;
  notificationcount: any;
  usertype: any


  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router,
    private langService: LangService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private chatNotificationCountService: ChatNotificationCountService,
    public companyLogoService: CompanyLogoService
  ) {
    this.languages = this.langService.supportedLanguages;
    this.currentLanguage = this.langService.languageShorthand;
    this.isSingleLang = this.langService.isSingleLang;
    this.isDarkModeActive = getThemeColor().indexOf('dark') > -1 ? true : false;
  }

  onDarkModeChange(event): void {
    let color = getThemeColor();
    if (color.indexOf('dark') > -1) {
      color = color.replace('dark', 'light');
    } else if (color.indexOf('light') > -1) {
      color = color.replace('light', 'dark');
    }
    setThemeColor(color);
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }
  notificationClick() {
    this.router.navigate(['app/notification']);
  }

  fullScreenClick(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  @HostListener('document:fullscreenchange', ['$event'])
  handleFullscreen(event): void {
    if (document.fullscreenElement) {
      this.isFullScreen = true;
    } else {
      this.isFullScreen = false;
    }
  }

  onLanguageChange(lang): void {
    this.langService.language = lang.code;
    this.currentLanguage = this.langService.languageShorthand;
  }

  async ngOnInit(): Promise<void> {
    this.usertype = +localStorage.getItem('usertype');
    this.companyLogoService.companyLogo$.subscribe((logo) => {
      if(logo) {
        this.validateCompanyLogo(logo);
      }
    });
    if (await this.authService.getUser()) {
      this.displayName = await this.authService.getUser().then((user) => {
        return user.displayName;
      });
    }
    this.subscription = this.sidebarService.getSidebar().subscribe(
      (res) => {
        this.sidebar = res;
      },
      (err) => {
        console.error(`An error occurred: ${err.message}`);
      },
    );
    this.getUnreadNotificationCount();

    let companyid = localStorage.getItem('company_id');
    this.api
      .callApi(this.constant.VIEWCOMPANYDATA + companyid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.companydata = res.data;
          if (this.companydata.companyLogo != '' && this.companydata.companyLogo != null) {
            this.companyLogoService.setCompanyLogo(this.companydata.companyLogo);
          } else {
            this.imgshow = false;
          }
        },
        (err) => {
          console.log('error', err);
        },
      );
    //Notification Count
    ////////////
    this.api
      .callApi(
        this.constant.VIEWCOMPANYCONTACTDATA + localStorage.getItem('id'),
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.userdata = res.data;

          if (this.userdata.photo != '' && this.userdata.photo != null) {
            this.imgshow1 = true;
            var img = new Image();
            img.src = this.apiURL + 'uploads/user/photo/' + this.userdata.photo;

            if (img.complete) {
              this.imgshow1 = true;
            } else {
              img.onload = () => {
                this.imgshow1 = true;
              };

              img.onerror = () => {
                this.imgshow1 = false;
              };
            }
          } else {
            this.imgshow1 = false;
          }
        },
        (err) => {
          console.log('error', err);
        },
      );
  }

  validateCompanyLogo(companyLogo: string) {
    const img = new Image();
    img.src = this.apiURL + 'uploads/company/logo/' + companyLogo;
    if (img.complete) {
      this.imgshow = true;
    } else {
      img.onload = () => {
        this.imgshow = true;
      };

      img.onerror = () => {
        this.imgshow = false;
      };
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  menuButtonClick = (
    e: { stopPropagation: () => void },
    menuClickCount: number,
    containerClassnames: string,
  ) => {
    if (e) {
      e.stopPropagation();
    }

    setTimeout(() => {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('resize', false, false);
      window.dispatchEvent(event);
    }, 350);

    this.sidebarService.setContainerClassnames(
      ++menuClickCount,
      containerClassnames,
      this.sidebar.selectedMenuHasSubItems,
    );
  };

  mobileMenuButtonClick = (event: { stopPropagation: () => void }, containerClassnames: string) => {
    if (event) {
      event.stopPropagation();
    }
    this.sidebarService.clickOnMobileMenu(containerClassnames);
  };

  onSignOut(): void {
    // this.authService.signOut().subscribe(() => {
    //
    // });
    // this.chatNotificationCountService.logout();
    localStorage.clear();
    this.router.navigate(['user/login']);
  }

  searchKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.search();
    } else if (event.key === 'Escape') {
      const input = document.querySelector('.mobile-view');
      if (input && input.classList) {
        input.classList.remove('mobile-view');
      }
      this.searchKey = '';
    }
  }

  searchAreaClick(event): void {
    event.stopPropagation();
  }
  searchClick(event): void {
    if (window.innerWidth < environment.menuHiddenBreakpoint) {
      let elem = event.target;
      if (!event.target.classList.contains('search')) {
        if (event.target.parentElement.classList.contains('search')) {
          elem = event.target.parentElement;
        } else if (event.target.parentElement.parentElement.classList.contains('search')) {
          elem = event.target.parentElement.parentElement;
        }
      }

      if (elem.classList.contains('mobile-view')) {
        this.search();
        elem.classList.remove('mobile-view');
      } else {
        elem.classList.add('mobile-view');
      }
    } else {
      this.search();
    }
    event.stopPropagation();
  }

  search(): void {
    if (this.searchKey && this.searchKey.length > 1) {
      this.router.navigate([this.adminRoot + '/pages/miscellaneous/search'], {
        queryParams: { key: this.searchKey.toLowerCase().trim() },
      });
      this.searchKey = '';
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event): void {
    const input = document.querySelector('.mobile-view');
    if (input && input.classList) {
      input.classList.remove('mobile-view');
    }
    this.searchKey = '';
  }

  getUnreadNotificationCount() {
    let body = {
      userMasterID: localStorage.getItem('id'),
    };

    this.api.callApi(this.constant.GETNOTIFICATIONCOUNT, body, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.notificationcount = res.data;
      },
      (err) => {
        console.log('error', err);
      },
    );
  }

  onClick() {
    this.router.navigate(['app/notification']);
    this.notificationcount = 0;
  }

  togglePopup(){
    this.popUp.openModal()
  }
}
