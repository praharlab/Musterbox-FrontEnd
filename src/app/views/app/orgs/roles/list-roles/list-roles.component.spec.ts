import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListRolesComponent } from './list-roles.component';

describe('ListRolesComponent', () => {
  let component: ListRolesComponent;
  let fixture: ComponentFixture<ListRolesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListRolesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
