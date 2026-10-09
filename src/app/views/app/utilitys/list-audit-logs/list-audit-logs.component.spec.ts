import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAuditLogsComponent } from './list-audit-logs.component';

describe('ListAuditLogsComponent', () => {
  let component: ListAuditLogsComponent;
  let fixture: ComponentFixture<ListAuditLogsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAuditLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAuditLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
