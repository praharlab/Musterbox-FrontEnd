import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CloneRolesComponent } from './clone-roles.component';

describe('CloneRolesComponent', () => {
  let component: CloneRolesComponent;
  let fixture: ComponentFixture<CloneRolesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CloneRolesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
