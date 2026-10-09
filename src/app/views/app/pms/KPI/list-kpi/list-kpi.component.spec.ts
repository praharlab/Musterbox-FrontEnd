import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListKpiComponent } from './list-kpi.component';

describe('ListKpiComponent', () => {
  let component: ListKpiComponent;
  let fixture: ComponentFixture<ListKpiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListKpiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
