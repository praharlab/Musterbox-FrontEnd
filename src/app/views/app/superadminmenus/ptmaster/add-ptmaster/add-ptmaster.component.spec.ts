import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddPtmasterComponent } from './add-ptmaster.component';

describe('AddPtmasterComponent', () => {
  let component: AddPtmasterComponent;
  let fixture: ComponentFixture<AddPtmasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddPtmasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPtmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
