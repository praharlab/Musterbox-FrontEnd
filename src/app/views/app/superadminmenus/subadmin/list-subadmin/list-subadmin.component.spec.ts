import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListSubadminComponent } from './list-subadmin.component';

describe('ListSubadminComponent', () => {
  let component: ListSubadminComponent;
  let fixture: ComponentFixture<ListSubadminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListSubadminComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSubadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
