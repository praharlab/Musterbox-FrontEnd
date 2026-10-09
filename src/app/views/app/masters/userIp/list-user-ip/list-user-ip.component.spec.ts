import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListUserIpComponent } from './list-user-ip.component';

describe('ListUserIpComponent', () => {
  let component: ListUserIpComponent;
  let fixture: ComponentFixture<ListUserIpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListUserIpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUserIpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
