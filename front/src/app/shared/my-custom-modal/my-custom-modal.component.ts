import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'my-custom-modal',
  templateUrl: './my-custom-modal.component.html',
  styleUrls: ['./my-custom-modal.component.scss']
})
export class MyCustomModalComponent {
  @Input() mostrar = false;
  @Output() onModalFechou = new EventEmitter<string>();

  constructor() { }

  toggle () {
    this.mostrar = false;

    this.onModalFechou.emit()
  }
}