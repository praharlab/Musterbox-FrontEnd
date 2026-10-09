import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportShowShiftRosterDataComponent } from './import-show-shift-roster-data.component';

describe('ImportShowShiftRosterDataComponent', () => {
  let component: ImportShowShiftRosterDataComponent;
  let fixture: ComponentFixture<ImportShowShiftRosterDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportShowShiftRosterDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportShowShiftRosterDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
