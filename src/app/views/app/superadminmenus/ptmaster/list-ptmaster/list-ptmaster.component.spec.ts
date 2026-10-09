import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListPtmasterComponent } from './list-ptmaster.component';

describe('ListPtmasterComponent', () => {
  let component: ListPtmasterComponent;
  let fixture: ComponentFixture<ListPtmasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListPtmasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPtmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
