import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportManualLeaveComponent } from './import-manual-leave.component';

describe('ImportManualLeaveComponent', () => {
  let component: ImportManualLeaveComponent;
  let fixture: ComponentFixture<ImportManualLeaveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportManualLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportManualLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
