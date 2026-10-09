import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportNdaCategoryComponent } from './import-nda-category.component';

describe('ImportNdaCategoryComponent', () => {
  let component: ImportNdaCategoryComponent;
  let fixture: ComponentFixture<ImportNdaCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportNdaCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportNdaCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
