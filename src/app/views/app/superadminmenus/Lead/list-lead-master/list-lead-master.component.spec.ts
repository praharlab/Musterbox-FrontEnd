import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListLeadMasterComponent } from './list-lead-master.component';

describe('ListLeadMasterComponent', () => {
  let component: ListLeadMasterComponent;
  let fixture: ComponentFixture<ListLeadMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListLeadMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLeadMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
