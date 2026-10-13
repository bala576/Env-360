import { Component, ElementRef, HostBinding, HostListener, Input, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface DropdownOption {
  label: string;
  value: unknown;
  disabled?: boolean;
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Dropdown), multi: true }],
})
export class Dropdown implements ControlValueAccessor {
  @Input() options: DropdownOption[] = [];
  @Input() placeholder = 'Select';

  private host = inject(ElementRef<HTMLElement>);

  value: unknown = null;
  @HostBinding('class.is-open') open = false;
  activeIndex = -1;
  disabled = false;

  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  get selected(): DropdownOption | undefined {
    return this.options.find(o => o.value === this.value);
  }

  toggle(): void {
    if (this.disabled) return;
    this.open ? this.close() : this.openMenu();
  }

  openMenu(): void {
    this.open = true;
    this.activeIndex = Math.max(0, this.options.findIndex(o => o.value === this.value));
  }

  close(): void {
    this.open = false;
    this.onTouched();
  }

  select(option: DropdownOption): void {
    if (option.disabled) return;
    this.value = option.value;
    this.onChange(option.value);
    this.close();
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled) return;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        if (!this.open) {
          this.openMenu();
          return;
        }
        this.moveActive(event.key === 'ArrowDown' ? 1 : -1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.open && this.options[this.activeIndex]) {
          this.select(this.options[this.activeIndex]);
        } else {
          this.openMenu();
        }
        break;
      case 'Escape':
      case 'Tab':
        if (this.open) this.close();
        break;
    }
  }

  private moveActive(step: number): void {
    const count = this.options.length;
    for (let i = 1; i <= count; i++) {
      const next = (this.activeIndex + step * i + count) % count;
      if (!this.options[next].disabled) {
        this.activeIndex = next;
        this.scrollActiveIntoView();
        return;
      }
    }
  }

  // No scrollbar is shown, so keep the keyboard-highlighted option visible
  private scrollActiveIntoView(): void {
    setTimeout(() => {
      const el = this.host.nativeElement.querySelector('.dd-option.active') as HTMLElement | null;
      el?.scrollIntoView({ block: 'nearest' });
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open && !this.host.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  writeValue(value: unknown): void {
    this.value = value;
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
}
