import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListempLeaveComponent } from './listemp-leave.component';

describe('ListempLeaveComponent', () => {
  let component: ListempLeaveComponent;
  let fixture: ComponentFixture<ListempLeaveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListempLeaveComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListempLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
