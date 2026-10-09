import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListMailFieldsComponent } from './list-mail-fields.component';

describe('ListMailFieldsComponent', () => {
  let component: ListMailFieldsComponent;
  let fixture: ComponentFixture<ListMailFieldsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListMailFieldsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMailFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
