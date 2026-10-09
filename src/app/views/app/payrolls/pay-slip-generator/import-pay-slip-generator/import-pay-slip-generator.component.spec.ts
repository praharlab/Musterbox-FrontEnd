import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportPaySlipGeneratorComponent } from './import-pay-slip-generator.component';

describe('ImportPaySlipGeneratorComponent', () => {
  let component: ImportPaySlipGeneratorComponent;
  let fixture: ComponentFixture<ImportPaySlipGeneratorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportPaySlipGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportPaySlipGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
