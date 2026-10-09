import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListCompanyServiceStatusComponent } from './list-company-service-status.component';

describe('ListCompanyServiceStatusComponent', () => {
  let component: ListCompanyServiceStatusComponent;
  let fixture: ComponentFixture<ListCompanyServiceStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCompanyServiceStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCompanyServiceStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
