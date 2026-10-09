import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListjoiningRequestComponent } from './listjoining-request.component';

describe('ListjoiningRequestComponent', () => {
  let component: ListjoiningRequestComponent;
  let fixture: ComponentFixture<ListjoiningRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListjoiningRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListjoiningRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
