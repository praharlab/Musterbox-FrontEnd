import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListWorkingAreaComponent } from './list-working-area.component';

describe('ListWorkingAreaComponent', () => {
  let component: ListWorkingAreaComponent;
  let fixture: ComponentFixture<ListWorkingAreaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListWorkingAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWorkingAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
