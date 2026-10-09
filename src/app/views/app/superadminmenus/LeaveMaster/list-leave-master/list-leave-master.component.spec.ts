import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListLeaveMasterComponent } from './list-leave-master.component';

describe('ListLeaveMasterComponent', () => {
  let component: ListLeaveMasterComponent;
  let fixture: ComponentFixture<ListLeaveMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListLeaveMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLeaveMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
