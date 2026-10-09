import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddIncentivetypeComponent } from './add-incentivetype.component';

describe('AddIncentivetypeComponent', () => {
  let component: AddIncentivetypeComponent;
  let fixture: ComponentFixture<AddIncentivetypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddIncentivetypeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncentivetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
