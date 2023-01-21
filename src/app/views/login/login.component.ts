import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  //  nossas variáveis e métodos
  userModel = new User();
  mensagem = '';

  receberDados() {
    // console.log(this.userModel);

    const blackList = [
      'SELECT',
      'OR',
      ' ""="" ',
      '-- ',
      ';',
      '1 = 1',
      '1=1',
      'DROP',
      '""=""',
      "'='",
    ]; //lista de palavras chave
    let ataque = 0;

    blackList.forEach((palavra) => {
      if (this.userModel.email?.toUpperCase().includes(palavra)) {
        //encontrou sql injection
        ataque++;
      }
    });

    if (
      this.userModel.email == '' ||
      this.userModel.password == '' ||
      ataque > 0
    ) {
      //campos vazios ou está sob ataque
      this.mensagem = 'Preencher os campos corretamente';
    } else {
      // pode se logar

      //disparando/send
      this.userService.logarUsuario(this.userModel).subscribe({
        next: (response) => {
          //sucesso

          this.mensagem = 'Login efetuado com sucesso';
        },
        error: (responseError) => {
          //erro

          let txtError = responseError.error;
          console.log('[ERRO]', responseError);
          if (txtError == 'Cannot find user') {
            this.mensagem = 'Usuário Inválido';
          } else if (txtError == 'Incorrect password') {
            this.mensagem = 'Senha Incorreta';
          } else if (txtError == 'Password is too short') {
            this.mensagem = 'Senha muito curta';
          } else if (txtError == 'Email format is invalid') {
            this.mensagem = 'Formato de e-mail inválido';
          } else {
            this.mensagem = 'Verifique todos os campos e tente novamente.';
          }
        },
        complete: () => {
          window.alert('Agradecemos a preferência!');
        },
      });
    }
  } //fim da função
}
