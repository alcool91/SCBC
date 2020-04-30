import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit, AfterViewInit {

  @ViewChild('selDesigner', { static: false }) public selDesigner: ElementRef;
  @ViewChild('selFoundry', { static: true }) public selFoundry: ElementRef;
  @ViewChild('selAssembler', { static: true }) public selAssembler: ElementRef;
  @ViewChild('selManufacturer', { static: true }) public selManufacturer: ElementRef;
  @ViewChild('selRetailer', { static: true }) public selRetailer: ElementRef;

  constructor() {  }
  _user=''; _password=''; _address=''; _private_key='';
  _current_fn=0;
  NUMFUNCTIONS=2
  _chain=[]; _registered_users={}; _users_from_address={}; _users_on_chain=[]; _free_users=[];
  ngOnInit() {


  }
  ngAfterViewInit() {
    const that = this;
    this.getChain();
    console.log();
    this.getUsers();
    console.log(<HTMLSelectElement>document.getElementById('selDesigner'));
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
  getChain() {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8000/getchain', false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.onreadystatechange = function() {
    //   if(xhr.readyState == 4) {
    xhr.send();
    this._chain = JSON.parse(xhr.response);
    console.log(this._chain);
    //   }
    // }
    //xhr.send();
  }
  getUsers() {
    const that = this;
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8000/getusers');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        let data = JSON.parse(xhr.response);
        console.log(data);
        that._registered_users=data;
        for (let key in data) {
          that._users_from_address[data[key]] = key;
          let on_chain = false;
          for(var i = 0; i < that._chain.length; i++) {
            if(data[key] == that._chain[i]) {
              that._users_on_chain.push(key);
              on_chain = true;
            }
          }
          if(!on_chain) {
            that._free_users.push(key);
          }
        }
      }
    }
    xhr.send();
  }
  adjustUserList(event: Event, _index) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8000/registeruser');
    xhr.setRequestHeader('Content-Type', 'application/json');
    let raw_event_data = <HTMLSelectElement>event.target.value;
    for(var i = 0; i < this._free_users.length; i++) {
      if(this._registered_users[this._free_users[i]] == raw_event_data) {
        let t = this._free_users[i];
        this._users_on_chain.push(t);
      }
    }
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        console.log(xhr.response);
      }
    }
    xhr.send(JSON.stringify({ address: raw_event_data, index: _index}));
    this._chain[_index] = raw_event_data;
  }
  getCurrentFn() {
    return this._current_fn;
  }
  isAddUser() {
    //console.log(this.getCurrentFn() == 0)
    return (this.getCurrentFn() == 0)
  }
  isManageChain() {
    //console.log(this.getCurrentFn() == 1)
    return (this.getCurrentFn() == 1)
  }
  nextFn() {
    this._current_fn = (((this._current_fn + 1) % this.NUMFUNCTIONS) + this.NUMFUNCTIONS) % this.NUMFUNCTIONS;
    // if (this._current_fn == 1) {
    //   console.log(document.getElementById('selDesigner'))
    //   for(var i = 0; i < this._free_users.length; i++) {
    //     document.getElementById('selDesigner').innerHTML += `<option>${this._registered_users[this._free_users[i]]}</option>`
    //   }
    // }
  }
  prevFn() {
    this._current_fn = (((this._current_fn - 1) % this.NUMFUNCTIONS) + this.NUMFUNCTIONS) % this.NUMFUNCTIONS;
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
        that._registered_users[data.user] = data.address;
        that._users_from_address[data.address] = data.user;
        that._free_users.push(data.user);
        alert(xhr.response);
      }
    }
    console.log(data);
    console.log(JSON.stringify(data));
    console.log(typeof JSON.stringify(data))
    xhr.send(JSON.stringify(data));
  }
  isAdmin() {
    if((localStorage.getItem('user') == 'admin1')) { return true; }
    return false;
  }
}
