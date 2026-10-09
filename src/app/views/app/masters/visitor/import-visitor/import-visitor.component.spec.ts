import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportVisitorComponent } from './import-visitor.component';

describe('ImportVisitorComponent', () => {
  let component: ImportVisitorComponent;
  let fixture: ComponentFixture<ImportVisitorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportVisitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
