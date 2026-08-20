import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-generic-popup',
  imports: [CommonModule],
  templateUrl: './generic-popup.html',
  styleUrl: './generic-popup.css',
})
export class GenericPopup {

  @Input() isOpen = false;
  @Input() title = '';

  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }
}
