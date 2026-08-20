import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-form-toggle',
  imports: [],
  templateUrl: './form-toggle.html',
  styleUrl: './form-toggle.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormToggle),
      multi: true,
    },
  ],
})
export class FormToggle implements ControlValueAccessor {

  @Input() onLabel = 'Active';
  @Input() offLabel = 'Inactive';
  @Input() onValue: any = 'Active';
  @Input() offValue: any = 'Inactive';

  checked = false;
  disabled = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.checked = value === this.onValue;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggle(): void {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.onChange(this.checked ? this.onValue : this.offValue);
    this.onTouched();
  }
}
