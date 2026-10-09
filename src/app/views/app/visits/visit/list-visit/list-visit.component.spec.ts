import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListVisitComponent } from './list-visit.component';

describe('ListVisitComponent', () => {
  let component: ListVisitComponent;
  let fixture: ComponentFixture<ListVisitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListVisitComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
