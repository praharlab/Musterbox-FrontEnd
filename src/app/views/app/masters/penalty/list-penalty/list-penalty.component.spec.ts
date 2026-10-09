import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListPenaltyComponent } from './list-penalty.component';

describe('ListPenaltyComponent', () => {
  let component: ListPenaltyComponent;
  let fixture: ComponentFixture<ListPenaltyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListPenaltyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPenaltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
