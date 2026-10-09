import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListNdaCategoryComponent } from './list-nda-category.component';

describe('ListNdaCategoryComponent', () => {
  let component: ListNdaCategoryComponent;
  let fixture: ComponentFixture<ListNdaCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListNdaCategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNdaCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
