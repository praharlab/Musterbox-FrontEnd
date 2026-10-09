import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddOfferletterComponent } from './add-offerletter.component';

describe('AddOfferletterComponent', () => {
  let component: AddOfferletterComponent;
  let fixture: ComponentFixture<AddOfferletterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOfferletterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOfferletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
