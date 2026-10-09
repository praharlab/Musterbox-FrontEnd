import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddUserIpComponent } from './add-user-ip.component';

describe('AddUserIpComponent', () => {
  let component: AddUserIpComponent;
  let fixture: ComponentFixture<AddUserIpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserIpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserIpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
