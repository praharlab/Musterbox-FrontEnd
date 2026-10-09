import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ErpsyncComponent } from './erpsync.component';

describe('ErpsyncComponent', () => {
  let component: ErpsyncComponent;
  let fixture: ComponentFixture<ErpsyncComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ErpsyncComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErpsyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
