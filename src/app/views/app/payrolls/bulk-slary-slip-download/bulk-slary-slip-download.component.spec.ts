import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkSlarySlipDownloadComponent } from './bulk-slary-slip-download.component';

describe('BulkSlarySlipDownloadComponent', () => {
  let component: BulkSlarySlipDownloadComponent;
  let fixture: ComponentFixture<BulkSlarySlipDownloadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkSlarySlipDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSlarySlipDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
