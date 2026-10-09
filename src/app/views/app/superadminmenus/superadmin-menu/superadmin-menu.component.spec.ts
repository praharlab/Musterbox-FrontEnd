import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SuperadminMenuComponent } from './superadmin-menu.component';

describe('SuperadminMenuComponent', () => {
  let component: SuperadminMenuComponent;
  let fixture: ComponentFixture<SuperadminMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SuperadminMenuComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperadminMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
