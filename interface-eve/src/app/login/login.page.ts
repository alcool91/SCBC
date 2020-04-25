import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor() { }
  _user = ''; _password = '';
  verifyUser() {
    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:8000/verifyuser';
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        let raw_data = xhr.response;
        let data = JSON.parse(raw_data);
        console.log(data);
      }
    }
    xhr.send(JSON.stringify({user: this._user, password: this._password}));
  }

  onUpdateUser(event: Event) {
    this._user = <HTMLInputElement>event.target.value;
  }
  onUpdatePassword(event: Event) {
    this._password = <HTMLInputElement>event.target.value;
  }

  ngOnInit() {
  }

}
