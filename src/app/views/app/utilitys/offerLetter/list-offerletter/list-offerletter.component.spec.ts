import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListOfferletterComponent } from './list-offerletter.component';

describe('ListOfferletterComponent', () => {
  let component: ListOfferletterComponent;
  let fixture: ComponentFixture<ListOfferletterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfferletterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfferletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
