import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListSalarypolicyComponent } from './list-salarypolicy.component';

describe('ListSalarypolicyComponent', () => {
  let component: ListSalarypolicyComponent;
  let fixture: ComponentFixture<ListSalarypolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListSalarypolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSalarypolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
