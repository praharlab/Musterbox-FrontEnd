import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListCompanyProgressComponent } from './list-company-progress.component';

describe('ListCompanyProgressComponent', () => {
  let component: ListCompanyProgressComponent;
  let fixture: ComponentFixture<ListCompanyProgressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCompanyProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCompanyProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
