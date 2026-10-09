import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListSuperadminComponent } from './list-superadmin.component';

describe('ListSuperadminComponent', () => {
  let component: ListSuperadminComponent;
  let fixture: ComponentFixture<ListSuperadminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListSuperadminComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSuperadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
