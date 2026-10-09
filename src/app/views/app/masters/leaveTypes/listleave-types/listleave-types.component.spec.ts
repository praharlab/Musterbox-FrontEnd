import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListleaveTypesComponent } from './listleave-types.component';

describe('ListleaveTypesComponent', () => {
  let component: ListleaveTypesComponent;
  let fixture: ComponentFixture<ListleaveTypesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListleaveTypesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListleaveTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
