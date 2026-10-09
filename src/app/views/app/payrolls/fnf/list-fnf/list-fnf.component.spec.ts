import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListFnfComponent } from './list-fnf.component';

describe('ListFnfComponent', () => {
  let component: ListFnfComponent;
  let fixture: ComponentFixture<ListFnfComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFnfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFnfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
