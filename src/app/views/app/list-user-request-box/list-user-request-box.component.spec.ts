import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListUserRequestBoxComponent } from './list-user-request-box.component';

describe('ListUserRequestBoxComponent', () => {
  let component: ListUserRequestBoxComponent;
  let fixture: ComponentFixture<ListUserRequestBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListUserRequestBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUserRequestBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
