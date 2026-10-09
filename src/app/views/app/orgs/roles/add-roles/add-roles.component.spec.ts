import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddRolesComponent } from './add-roles.component';

describe('AddRolesComponent', () => {
  let component: AddRolesComponent;
  let fixture: ComponentFixture<AddRolesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddRolesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
