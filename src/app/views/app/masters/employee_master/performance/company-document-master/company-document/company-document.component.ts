import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, Observer } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-company-document',
    templateUrl: './company-document.component.html',
    styleUrls: ['./company-document.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CompanyDocumentComponent implements OnInit {

  rows8: any;
  page = {
    totalCount: 0,
    offset: 0,
  };
  apiURL = environment.apiUrl;
  base64Image: string;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,


  ) { }

  ngOnInit(): void {
    this.companyDocument()
  }

  companyDocument() {
    const filterData = {
      page: 1,
      limit: 10,
      company_id: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETUSERCOMPDOCUMENT + localStorage.getItem('id'),
        filterData,
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows8 = res.data;
          for (var i = 0; i < this.rows8.length; i++) {
            let extension = this.rows8[i].document.substring(
              this.rows8[i].document.lastIndexOf('.') + 1,
            );
            if (extension == 'pdf') {
              this.rows8[i].checkpdf = true;
            } else {
              this.rows8[i].checkpdf = false;
            }
          }

          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
  }

  download(item) {
    const image = item.document;

    let url = this.apiURL + 'uploads/company/document/' + image;
    if (item.checkpdf == true) {
      // let headers = new HttpHeaders();
      // headers = headers.set('Accept', 'application/pdf');
      // return this.http.get(url, { headers: headers, responseType: 'blob' });

      window.open(url);
    } else {
      this.getBase64ImageFromURL(url).subscribe((base64data) => {
        this.base64Image = 'data:image/jpg;base64,' + base64data;
        // save image to disk
        var link = document.createElement('a');

        document.body.appendChild(link); // for Firefox

        link.setAttribute('href', this.base64Image);
        link.setAttribute('download', item.documentType.documentName + '.jpg');
        link.click();
      });
    }

  }

  getBase64ImageFromURL(url: string) {
      return Observable.create((observer: Observer<string>) => {
        const img: HTMLImageElement = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;

        if (!img.complete) {
          img.onload = () => {
            observer.next(this.getBase64Image(img));
            observer.complete();
          };
          img.onerror = (err) => {
            console.log(err, 'error')
            observer.error(err);
          };
        } else {
          observer.next(this.getBase64Image(img));
          observer.complete();
        }
      });
    }

    getBase64Image(img: HTMLImageElement) {
      const canvas: HTMLCanvasElement = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataURL: string = canvas.toDataURL('image/png');
  
      return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
    }
}
