import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportAuthorizationComponent } from './import-authorization.component';

describe('ImportAuthorizationComponent', () => {
  let component: ImportAuthorizationComponent;
  let fixture: ComponentFixture<ImportAuthorizationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
