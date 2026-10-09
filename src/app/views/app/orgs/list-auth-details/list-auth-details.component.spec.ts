import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAuthDetailsComponent } from './list-auth-details.component';

describe('ListAuthDetailsComponent', () => {
  let component: ListAuthDetailsComponent;
  let fixture: ComponentFixture<ListAuthDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListAuthDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAuthDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
