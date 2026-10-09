import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
@Component({
    selector: 'app-profile-pic',
    templateUrl: './profile-pic.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ProfilePicComponent implements OnInit {
  @Input() firstName: string = '';
  @Input() lastName: string = '';
  @Input() Style: string = '';
  @Input() Class: string = '';
  initials: string = '';

  ngOnInit(): void {
    this.generateInitials();
  }

  generateInitials(): void {
    if (this.firstName && this.lastName) {
      this.initials = `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
    }
  }
}
