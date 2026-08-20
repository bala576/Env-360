import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenericPopup } from '../generic-popup/generic-popup';
import { DeviceHealth } from '../../features/configuration/device/device-store';

@Component({
  selector: 'app-device-health-popup',
  imports: [CommonModule, GenericPopup],
  templateUrl: './device-health-popup.html',
  styleUrl: './device-health-popup.css',
})
export class DeviceHealthPopup {

  @Input() isOpen = false;
  @Input() deviceId = '';
  @Input() health: DeviceHealth | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() viewDevice = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }

  onViewDevice(): void {
    this.viewDevice.emit();
  }
}
