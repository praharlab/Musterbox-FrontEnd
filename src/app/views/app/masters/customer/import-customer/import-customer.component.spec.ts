import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportCustomerComponent } from './import-customer.component';

describe('ImportCustomerComponent', () => {
  let component: ImportCustomerComponent;
  let fixture: ComponentFixture<ImportCustomerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
