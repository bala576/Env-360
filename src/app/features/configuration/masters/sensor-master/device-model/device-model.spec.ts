import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceModel } from './device-model';

describe('DeviceModel', () => {
  let component: DeviceModel;
  let fixture: ComponentFixture<DeviceModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceModel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceModel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
