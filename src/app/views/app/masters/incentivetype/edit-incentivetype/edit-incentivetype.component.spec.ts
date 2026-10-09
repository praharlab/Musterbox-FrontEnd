import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditIncentivetypeComponent } from './edit-incentivetype.component';

describe('EditIncentivetypeComponent', () => {
  let component: EditIncentivetypeComponent;
  let fixture: ComponentFixture<EditIncentivetypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditIncentivetypeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIncentivetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
