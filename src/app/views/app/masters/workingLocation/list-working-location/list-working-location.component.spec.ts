import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListWorkingLocationComponent } from './list-working-location.component';

describe('ListWorkingLocationComponent', () => {
  let component: ListWorkingLocationComponent;
  let fixture: ComponentFixture<ListWorkingLocationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListWorkingLocationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWorkingLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
