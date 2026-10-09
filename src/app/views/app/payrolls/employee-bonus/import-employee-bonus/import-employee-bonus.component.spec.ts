import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportEmployeeBonusComponent } from './import-employee-bonus.component';

describe('ImportEmployeeBonusComponent', () => {
  let component: ImportEmployeeBonusComponent;
  let fixture: ComponentFixture<ImportEmployeeBonusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportEmployeeBonusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportEmployeeBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
