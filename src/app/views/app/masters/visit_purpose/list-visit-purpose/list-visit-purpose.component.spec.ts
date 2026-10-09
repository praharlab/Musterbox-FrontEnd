import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListVisitPurposeComponent } from './list-visit-purpose.component';

describe('ListVisitPurposeComponent', () => {
  let component: ListVisitPurposeComponent;
  let fixture: ComponentFixture<ListVisitPurposeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListVisitPurposeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVisitPurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
