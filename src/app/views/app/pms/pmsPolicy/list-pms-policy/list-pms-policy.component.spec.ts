import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListPmsPolicyComponent } from './list-pms-policy.component';

describe('ListPmsPolicyComponent', () => {
  let component: ListPmsPolicyComponent;
  let fixture: ComponentFixture<ListPmsPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPmsPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPmsPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
