import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAuthorizationDataComponent } from './list-authorization-data.component';

describe('ListAuthorizationDataComponent', () => {
  let component: ListAuthorizationDataComponent;
  let fixture: ComponentFixture<ListAuthorizationDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAuthorizationDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAuthorizationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
