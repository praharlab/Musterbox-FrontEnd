import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListProductMasterComponent } from './list-product-master.component';

describe('ListProductMasterComponent', () => {
  let component: ListProductMasterComponent;
  let fixture: ComponentFixture<ListProductMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListProductMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProductMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
