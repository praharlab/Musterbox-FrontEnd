import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListGatepassComponent } from './list-gatepass.component';

describe('ListGatepassComponent', () => {
  let component: ListGatepassComponent;
  let fixture: ComponentFixture<ListGatepassComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListGatepassComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGatepassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
