import { Component, OnInit, Renderer2, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { LangService } from './shared/lang.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { setTheme } from 'ngx-bootstrap/utils';
// const API_URL = "http://localhost:3000";
const API_URL = environment.apiUrl;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
@Injectable()
export class AppComponent implements OnInit, AfterViewInit {
  constructor(
    public router: Router,
    private langService: LangService,
    private renderer: Renderer2,
    private _http: HttpClient,
  ) {
    // The app ships Bootstrap 4 CSS; don't rely on ngx-bootstrap's version auto-detection.
    setTheme('bs4');
  }

  ngOnInit(): void {
    this.langService.init();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderer.addClass(document.body, 'show');
    }, 1000);
    setTimeout(() => {
      this.renderer.addClass(document.body, 'default-transition');
    }, 1500);
  }

  
}
