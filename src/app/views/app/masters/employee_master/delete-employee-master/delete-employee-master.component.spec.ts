import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeleteEmployeeMasterComponent } from './delete-employee-master.component';

describe('DeleteEmployeeMasterComponent', () => {
  let component: DeleteEmployeeMasterComponent;
  let fixture: ComponentFixture<DeleteEmployeeMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteEmployeeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteEmployeeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
