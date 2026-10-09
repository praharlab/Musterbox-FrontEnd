import { Component, HostListener, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-application-menu',
    templateUrl: './application-menu.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ApplicationMenuComponent {
  isOpen = false;

  constructor() {}

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event): void {
    if (this.isOpen) {
      this.toggle();
    }
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  menuClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
