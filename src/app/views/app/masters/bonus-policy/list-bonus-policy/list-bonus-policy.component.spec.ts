import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListBonusPolicyComponent } from './list-bonus-policy.component';

describe('ListBonusPolicyComponent', () => {
  let component: ListBonusPolicyComponent;
  let fixture: ComponentFixture<ListBonusPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBonusPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBonusPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
