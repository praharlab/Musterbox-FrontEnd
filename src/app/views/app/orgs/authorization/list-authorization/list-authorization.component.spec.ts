import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAuthorizationComponent } from './list-authorization.component';

describe('ListAuthorizationComponent', () => {
  let component: ListAuthorizationComponent;
  let fixture: ComponentFixture<ListAuthorizationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListAuthorizationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
