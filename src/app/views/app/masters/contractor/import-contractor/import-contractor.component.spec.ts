import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportContractorComponent } from './import-contractor.component';

describe('ImportContractorComponent', () => {
  let component: ImportContractorComponent;
  let fixture: ComponentFixture<ImportContractorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportContractorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
