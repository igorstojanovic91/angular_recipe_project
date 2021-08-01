import {Directive, ElementRef, HostBinding, HostListener, OnInit} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective implements OnInit {

  @HostBinding('class.open') isOpen = false;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
  }

  //open
  @HostListener('click')
  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

}

