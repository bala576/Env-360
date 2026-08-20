import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceManagement } from './licence-management';

describe('LicenceManagement', () => {
  let component: LicenceManagement;
  let fixture: ComponentFixture<LicenceManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenceManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenceManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
