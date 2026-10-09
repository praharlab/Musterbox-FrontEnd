import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MailTemplateListComponent } from './mail-template-list.component';

describe('MailTemplateListComponent', () => {
  let component: MailTemplateListComponent;
  let fixture: ComponentFixture<MailTemplateListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MailTemplateListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
