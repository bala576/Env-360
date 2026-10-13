import { Directive, ElementRef, HostBinding, HostListener, OnDestroy, inject } from '@angular/core';

/**
 * Click-and-drag horizontal scrolling for containers whose scrollbar is hidden.
 * Mouse only (touch and trackpads already scroll natively). A short movement
 * still counts as a click, and the click that ends a real drag is swallowed so
 * it doesn't trigger row selection underneath.
 */
@Directive({
  selector: '[appDragScroll]',
})
export class DragScroll implements OnDestroy {
  private host = inject(ElementRef<HTMLElement>);
  private drag: { startX: number; scrollLeft: number; pointerId: number } | null = null;
  private suppressClick = false;

  @HostBinding('class.drag-scroll') readonly enabled = true;
  @HostBinding('class.dragging') dragging = false;

  // Capture phase so the click is stopped before it reaches rows or checkboxes
  private onClickCapture = (event: MouseEvent): void => {
    if (!this.suppressClick) return;
    event.stopPropagation();
    event.preventDefault();
    this.suppressClick = false;
  };

  constructor() {
    this.host.nativeElement.addEventListener('click', this.onClickCapture, true);
  }

  @HostListener('pointerdown', ['$event'])
  onDown(event: PointerEvent): void {
    const el = this.host.nativeElement;
    if (event.pointerType !== 'mouse' || event.button !== 0 || el.scrollWidth <= el.clientWidth) return;
    this.drag = { startX: event.clientX, scrollLeft: el.scrollLeft, pointerId: event.pointerId };
  }

  @HostListener('pointermove', ['$event'])
  onMove(event: PointerEvent): void {
    if (!this.drag || event.pointerId !== this.drag.pointerId) return;
    const el = this.host.nativeElement;
    const dx = event.clientX - this.drag.startX;
    if (!this.dragging && Math.abs(dx) < 5) return;
    if (!this.dragging) {
      this.dragging = true;
      el.setPointerCapture(event.pointerId);
    }
    el.scrollLeft = this.drag.scrollLeft - dx;
  }

  @HostListener('pointerup', ['$event'])
  @HostListener('pointercancel', ['$event'])
  onUp(event: PointerEvent): void {
    if (!this.drag) return;
    if (this.dragging) {
      this.suppressClick = true;
      // Reset on next tick in case the release lands where no click fires
      setTimeout(() => (this.suppressClick = false));
      this.host.nativeElement.releasePointerCapture?.(event.pointerId);
    }
    this.drag = null;
    this.dragging = false;
  }

  ngOnDestroy(): void {
    this.host.nativeElement.removeEventListener('click', this.onClickCapture, true);
  }
}
