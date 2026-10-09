import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListVisitorComponent } from './list-visitor.component';

describe('ListVisitorComponent', () => {
  let component: ListVisitorComponent;
  let fixture: ComponentFixture<ListVisitorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListVisitorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
