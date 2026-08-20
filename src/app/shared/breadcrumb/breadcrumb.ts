import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface BreadcrumbDropdownItem {
  label: string;
  route: string;
}

export interface BreadcrumbItem {
  label: string;
  route?: string;
  children?: BreadcrumbDropdownItem[];
}

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.css',
})
export class Breadcrumb {

  @Input() items: BreadcrumbItem[] = [];

  openIndex: number | null = null;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  toggleDropdown(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }

  closeDropdown(): void {
    this.openIndex = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeDropdown();
    }
  }
}
