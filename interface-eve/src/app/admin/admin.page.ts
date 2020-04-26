import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  constructor() { }
  _user=''; _password=''; _address=''; _private_key='';
  ngOnInit() {
  }
  onUpdateUser(event: Event) {
    this._user = <HTMLInputElement>event.target.value;
  }
  onUpdatePassword(event: Event) {
    this._password = <HTMLInputElement>event.target.value;
  }
  onUpdateAddress(event: Event) {
    this._address = <HTMLInputElement>event.target.value;
  }
  onUpdatePrivateKey(event: Event) {
    this._private_key = <HTMLInputElement>event.target.value;
  }
  addUser() {
    const that = this;
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8000/newuser');
    xhr.setRequestHeader('Content-Type', 'application/json');
    let data = {};
    data.user = that._user;
    data.password = that._password;
    data.address = that._address;
    data.private_key = that._private_key;
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        console.log(xhr.response);
      }
    }
    console.log(data);
    console.log(JSON.stringify(data));
    console.log(typeof JSON.stringify(data))
    xhr.send(JSON.stringify(data));
  }
}
