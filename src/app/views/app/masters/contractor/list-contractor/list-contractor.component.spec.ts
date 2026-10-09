import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListContractorComponent } from './list-contractor.component';

describe('ListContractorComponent', () => {
  let component: ListContractorComponent;
  let fixture: ComponentFixture<ListContractorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListContractorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
