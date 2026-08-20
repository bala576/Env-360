import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Device } from './device';

describe('Device', () => {
  let component: Device;
  let fixture: ComponentFixture<Device>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Device],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Device);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
