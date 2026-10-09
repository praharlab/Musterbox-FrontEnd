import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAuthorizationmasterComponent } from './list-authorizationmaster.component';

describe('ListAuthorizationmasterComponent', () => {
  let component: ListAuthorizationmasterComponent;
  let fixture: ComponentFixture<ListAuthorizationmasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListAuthorizationmasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAuthorizationmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
