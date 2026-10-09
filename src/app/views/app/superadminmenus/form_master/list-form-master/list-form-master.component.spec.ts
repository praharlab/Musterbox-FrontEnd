import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListFormMasterComponent } from './list-form-master.component';

describe('ListFormMasterComponent', () => {
  let component: ListFormMasterComponent;
  let fixture: ComponentFixture<ListFormMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListFormMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFormMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
