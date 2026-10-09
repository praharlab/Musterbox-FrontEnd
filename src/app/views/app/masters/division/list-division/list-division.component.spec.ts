import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListDivisionComponent } from './list-division.component';

describe('ListDivisionComponent', () => {
  let component: ListDivisionComponent;
  let fixture: ComponentFixture<ListDivisionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDivisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
