import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentDashboard } from './equipment-dashboard';

describe('EquipmentDashboard', () => {
  let component: EquipmentDashboard;
  let fixture: ComponentFixture<EquipmentDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
