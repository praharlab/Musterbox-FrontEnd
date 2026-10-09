import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeNdaComponent } from './list-employee-nda.component';

describe('ListEmployeeNdaComponent', () => {
  let component: ListEmployeeNdaComponent;
  let fixture: ComponentFixture<ListEmployeeNdaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeNdaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeNdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
