import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListOperationComponent } from './list-operation.component';

describe('ListOperationComponent', () => {
  let component: ListOperationComponent;
  let fixture: ComponentFixture<ListOperationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListOperationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
