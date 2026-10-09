import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShortLeaveCancellationComponent } from './short-leave-cancellation.component';

describe('ShortLeaveCancellationComponent', () => {
  let component: ShortLeaveCancellationComponent;
  let fixture: ComponentFixture<ShortLeaveCancellationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortLeaveCancellationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortLeaveCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
