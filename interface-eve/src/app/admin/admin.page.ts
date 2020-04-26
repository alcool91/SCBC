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
}
