import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListMyGatepassComponent } from './list-my-gatepass.component';

describe('ListMyGatepassComponent', () => {
  let component: ListMyGatepassComponent;
  let fixture: ComponentFixture<ListMyGatepassComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMyGatepassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMyGatepassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
