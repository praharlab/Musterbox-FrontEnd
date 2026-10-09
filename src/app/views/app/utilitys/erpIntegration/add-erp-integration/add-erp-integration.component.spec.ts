import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddErpIntegrationComponent } from './add-erp-integration.component';

describe('AddErpIntegrationComponent', () => {
  let component: AddErpIntegrationComponent;
  let fixture: ComponentFixture<AddErpIntegrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddErpIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddErpIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
