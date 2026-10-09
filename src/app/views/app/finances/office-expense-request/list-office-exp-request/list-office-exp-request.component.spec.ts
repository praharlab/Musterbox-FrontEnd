import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListOfficeExpRequestComponent } from './list-office-exp-request.component';

describe('ListOfficeExpRequestComponent', () => {
  let component: ListOfficeExpRequestComponent;
  let fixture: ComponentFixture<ListOfficeExpRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfficeExpRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfficeExpRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
