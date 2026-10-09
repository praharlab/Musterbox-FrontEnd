import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkAddSalarypolicyComponent } from './bulk-add-salarypolicy.component';

describe('BulkAddSalarypolicyComponent', () => {
  let component: BulkAddSalarypolicyComponent;
  let fixture: ComponentFixture<BulkAddSalarypolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BulkAddSalarypolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAddSalarypolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
