import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'my-custom-input',
  templateUrl: './my-custom-input.component.html',
  styleUrls: ['./my-custom-input.component.scss']
})
export class MyCustomInputComponent implements OnInit {
  inputType: 'text' | 'email' | 'password' = 'text';
  /**
   * Controla visualização do tipo senha, se mostra input de texto ou de password
   */
  verSenha = false;
  @Input() placeholder = 'Digite...';
  @Input() tipo: 'texto' | 'texto-numerico' | 'email' | 'senha' = 'texto';
  @Input() valor: string = '';
  @Input() customClass = '';
  @Input() maxlength: any;
  @Output() onChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    if (this.tipo == 'email') {
      this.inputType = 'email';
    } else if (this.tipo == 'senha') {
      this.inputType = 'password';
    }
  }

  onKeyup(event: KeyboardEvent) {
    if (this.tipo == 'texto-numerico') {
      this.valor = this.valor.replace(/\D/g, '');
    }
    this.onChange.emit(this.valor);
  }

  /**
   * Disparado ao clicar no ícone de ver ou esconder senha
   * @param verSenha 
   */
  onIconeVerSenhaClick(verSenha: boolean){
    this.verSenha = verSenha;
    this.inputType = verSenha ? "text" : "password";
  }
}