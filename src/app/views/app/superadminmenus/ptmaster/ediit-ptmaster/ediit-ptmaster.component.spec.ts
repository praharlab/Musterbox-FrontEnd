import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EdiitPtmasterComponent } from './ediit-ptmaster.component';

describe('EdiitPtmasterComponent', () => {
  let component: EdiitPtmasterComponent;
  let fixture: ComponentFixture<EdiitPtmasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EdiitPtmasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdiitPtmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
