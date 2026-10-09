import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListIncentivetypeComponent } from './list-incentivetype.component';

describe('ListIncentivetypeComponent', () => {
  let component: ListIncentivetypeComponent;
  let fixture: ComponentFixture<ListIncentivetypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListIncentivetypeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListIncentivetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
