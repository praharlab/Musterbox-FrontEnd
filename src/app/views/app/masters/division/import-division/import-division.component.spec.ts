import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportDivisionComponent } from './import-division.component';

describe('ImportDivisionComponent', () => {
  let component: ImportDivisionComponent;
  let fixture: ComponentFixture<ImportDivisionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportDivisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
