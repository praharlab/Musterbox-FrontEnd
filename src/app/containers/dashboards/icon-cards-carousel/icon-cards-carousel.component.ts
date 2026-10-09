import { Component, Input, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { GlideComponent } from 'src/app/components/carousel/glide/glide.component';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

interface IIconCardItem {
  title: string;
  icon: string;
  value: number;
}

@Component({
    selector: 'app-icon-cards-carousel',
    templateUrl: './icon-cards-carousel.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class IconCardsCarouselComponent implements OnInit {
  @Input() class = 'icon-cards-row';
  @ViewChild('carousel', { static: false }) carousel: GlideComponent;
  data: any;

  constructor(
    private api: ApiService,
    private constant: ConstantService,
  ) {}
  ngOnInit(): void {
    let body;
    if (localStorage.getItem('admin') == '1') {
      body = {
        admin: 1,
        companyMasterID: localStorage.getItem('company_id'),
      };
    } else {
      body = {
        admin: 0,
        userMasterID: localStorage.getItem('id'),
      };
    }

    this.api
      .callApi(this.constant.DASHBOARD1, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.data = res.data;
        }
      });
  }
}
