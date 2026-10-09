import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListErpIntegrationComponent } from './list-erp-integration.component';

describe('ListErpIntegrationComponent', () => {
  let component: ListErpIntegrationComponent;
  let fixture: ComponentFixture<ListErpIntegrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListErpIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListErpIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
