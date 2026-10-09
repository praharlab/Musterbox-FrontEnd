import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LandscapeIdCardsComponent } from './landscape-id-cards.component';

describe('LandscapeIdCardsComponent', () => {
  let component: LandscapeIdCardsComponent;
  let fixture: ComponentFixture<LandscapeIdCardsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LandscapeIdCardsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandscapeIdCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
