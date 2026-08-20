import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManholeDashboard } from './manhole-dashboard';

describe('ManholeDashboard', () => {
  let component: ManholeDashboard;
  let fixture: ComponentFixture<ManholeDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManholeDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManholeDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
