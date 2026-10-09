import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeDeclarationComponent } from './employee-declaration.component';

describe('EmployeeDeclarationComponent', () => {
  let component: EmployeeDeclarationComponent;
  let fixture: ComponentFixture<EmployeeDeclarationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDeclarationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
