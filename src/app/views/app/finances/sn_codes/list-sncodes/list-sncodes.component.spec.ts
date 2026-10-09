import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListSncodesComponent } from './list-sncodes.component';

describe('ListSncodesComponent', () => {
  let component: ListSncodesComponent;
  let fixture: ComponentFixture<ListSncodesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSncodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSncodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
