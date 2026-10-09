import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpReqTableComponent } from './exp-req-table.component';

describe('ExpReqTableComponent', () => {
  let component: ExpReqTableComponent;
  let fixture: ComponentFixture<ExpReqTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpReqTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpReqTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
