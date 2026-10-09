import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportWorkingAreaComponent } from './import-working-area.component';

describe('ImportWorkingAreaComponent', () => {
  let component: ImportWorkingAreaComponent;
  let fixture: ComponentFixture<ImportWorkingAreaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportWorkingAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportWorkingAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
