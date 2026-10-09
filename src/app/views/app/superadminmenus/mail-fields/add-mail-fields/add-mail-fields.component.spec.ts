import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddMailFieldsComponent } from './add-mail-fields.component';

describe('AddMailFieldsComponent', () => {
  let component: AddMailFieldsComponent;
  let fixture: ComponentFixture<AddMailFieldsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddMailFieldsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMailFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
