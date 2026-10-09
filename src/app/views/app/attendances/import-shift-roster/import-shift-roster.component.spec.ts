import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportShiftRosterComponent } from './import-shift-roster.component';

describe('ImportShiftRosterComponent', () => {
  let component: ImportShiftRosterComponent;
  let fixture: ComponentFixture<ImportShiftRosterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportShiftRosterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportShiftRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
