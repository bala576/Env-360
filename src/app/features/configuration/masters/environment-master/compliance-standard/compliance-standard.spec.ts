import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceStandard } from './compliance-standard';

describe('ComplianceStandard', () => {
  let component: ComplianceStandard;
  let fixture: ComponentFixture<ComplianceStandard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplianceStandard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplianceStandard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
