import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditErpIntegrationComponent } from './edit-erp-integration.component';

describe('EditErpIntegrationComponent', () => {
  let component: EditErpIntegrationComponent;
  let fixture: ComponentFixture<EditErpIntegrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditErpIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditErpIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
