import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListJoiningRequestFormComponent } from './list-joining-request-form.component';

describe('ListJoiningRequestFormComponent', () => {
  let component: ListJoiningRequestFormComponent;
  let fixture: ComponentFixture<ListJoiningRequestFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListJoiningRequestFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListJoiningRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
