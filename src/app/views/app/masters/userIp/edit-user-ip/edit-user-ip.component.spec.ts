import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditUserIpComponent } from './edit-user-ip.component';

describe('EditUserIpComponent', () => {
  let component: EditUserIpComponent;
  let fixture: ComponentFixture<EditUserIpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUserIpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserIpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
