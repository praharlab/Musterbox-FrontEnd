import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListUserDataComponent } from './list-user-data.component';

describe('ListUserDataComponent', () => {
  let component: ListUserDataComponent;
  let fixture: ComponentFixture<ListUserDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListUserDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUserDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
