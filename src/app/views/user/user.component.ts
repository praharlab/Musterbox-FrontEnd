import { Component, OnInit, OnDestroy, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UserComponent implements OnInit, OnDestroy {

  loginRoutes = ['/user/login', '/user/forgot-password', '/user/reset-password', '/user/otp']

  constructor(private renderer: Renderer2, public router: Router) {}

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'background');
    this.renderer.addClass(document.body, 'no-footer');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'background');
    this.renderer.removeClass(document.body, 'no-footer');
  }
}
