import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkAddEmployeeProjectComponent } from './bulk-add-employee-project.component';

describe('BulkAddEmployeeProjectComponent', () => {
  let component: BulkAddEmployeeProjectComponent;
  let fixture: ComponentFixture<BulkAddEmployeeProjectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkAddEmployeeProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAddEmployeeProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
