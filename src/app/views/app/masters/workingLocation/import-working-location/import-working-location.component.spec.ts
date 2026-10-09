import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportWorkingLocationComponent } from './import-working-location.component';

describe('ImportWorkingLocationComponent', () => {
  let component: ImportWorkingLocationComponent;
  let fixture: ComponentFixture<ImportWorkingLocationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportWorkingLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportWorkingLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
