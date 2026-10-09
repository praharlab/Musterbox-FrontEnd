import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditOfferletterComponent } from './edit-offerletter.component';

describe('EditOfferletterComponent', () => {
  let component: EditOfferletterComponent;
  let fixture: ComponentFixture<EditOfferletterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOfferletterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOfferletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
