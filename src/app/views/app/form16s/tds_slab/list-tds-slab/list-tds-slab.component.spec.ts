import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListTdsSlabComponent } from './list-tds-slab.component';

describe('ListTdsSlabComponent', () => {
  let component: ListTdsSlabComponent;
  let fixture: ComponentFixture<ListTdsSlabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListTdsSlabComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTdsSlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
