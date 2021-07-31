import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output()
  fetureSelected: EventEmitter<string> = new EventEmitter<string>();
  collapsed = true;
  constructor() { }

  ngOnInit(): void {
  }

  onSelect(feature: string) {
    this.fetureSelected.emit(feature);
  }


}
