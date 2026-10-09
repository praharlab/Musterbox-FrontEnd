import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListMailTypeComponent } from './list-mail-type.component';

describe('ListMailTypeComponent', () => {
  let component: ListMailTypeComponent;
  let fixture: ComponentFixture<ListMailTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListMailTypeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMailTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
