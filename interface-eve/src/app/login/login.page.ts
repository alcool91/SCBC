import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router: Router) { }
  _user = ''; _password = '';
  verifyUser() {
    const that = this;
    let failDisplay;
    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:8000/verifyuser';
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        let raw_data = xhr.response;
        let data = JSON.parse(raw_data);
        if (data.verified == true) {
          document.getElementById("lblFail").innerHTML= '';
          localStorage.setItem("user", data.user);
          localStorage.setItem("account", data.account);
          localStorage.setItem("private_key", data.private_key);
          that.router.navigate(['/home']);
        }
        else {
          document.getElementById("lblFail").innerHTML= 'Login Failed!';
        }
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
