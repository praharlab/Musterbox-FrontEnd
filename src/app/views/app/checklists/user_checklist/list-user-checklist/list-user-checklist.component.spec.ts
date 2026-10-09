import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListUserChecklistComponent } from './list-user-checklist.component';

describe('ListUserChecklistComponent', () => {
  let component: ListUserChecklistComponent;
  let fixture: ComponentFixture<ListUserChecklistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListUserChecklistComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUserChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
