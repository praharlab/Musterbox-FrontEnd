import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListReportstoDataComponent } from './list-reportsto-data.component';

describe('ListReportstoDataComponent', () => {
  let component: ListReportstoDataComponent;
  let fixture: ComponentFixture<ListReportstoDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListReportstoDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListReportstoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
