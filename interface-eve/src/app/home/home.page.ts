import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
text ='default text';

  constructor(private router: Router) {
  }
  _my_received=[]; _my_inventory=[]; _my_flagged=[];
  _max_array_size = 0; _numbers=[];
  _chain = []; _chain_by_address = {};
  onChangeText(){
    this.text = 'Changed!';
  }
  isAdmin() {
    if((localStorage.getItem('user') == 'admin1')) { return true; }
    return false;
  }
  ngOnInit() {
    this.getInventories();
    this.getChain();
  }
  ngAfterViewInit() {
    //console.log("AFTER VIEW");
    // this.getInventories();
    // this.getChain();
  }
  getChain() {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8000/getchain', false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ from: localStorage.getItem('account')}));
    this._chain = JSON.parse(xhr.response);
    console.log(this._chain);
    for(var i = 0; i < this._chain.length; i++) {
      this._chain_by_address[this._chain[i]] = i;
    }
    console.log(this._chain_by_address);
  }
  getInventories() {
    console.log("getInventories");
    const that = this;
    let xhrr = new XMLHttpRequest();
    let xhri = new XMLHttpRequest();
    let xhrf = new XMLHttpRequest();
    this._my_inventory = [];
    this._my_received = [];
    this._my_flagged = [];
    xhrr.open('POST', 'http://localhost:8000/getreceived');
    xhrr.setRequestHeader('Content-Type', 'application/json');
    xhri.open('POST', 'http://localhost:8000/getinventory');
    xhri.setRequestHeader('Content-Type', 'application/json');
    xhrf.open('POST', 'http://localhost:8000/getflagged');
    xhrf.setRequestHeader('Content-Type', 'application/json');
    xhrr.onreadystatechange = function() {
      if(xhrr.readyState == 4) {
        //console.log("received");
        let data = JSON.parse(xhrr.response);
        let _data_length=0;
        for(var i = 0; i < data.length; i++) {
          if(data[i] != '0') {
            _data_length++;
            that._my_received.push(data[i]);
          }
        }
        if (_data_length > that._max_array_size) {
          that._max_array_size = _data_length;
          that._numbers = Array(that._max_array_size).fill().map((x,i)=>i);
         }
      }
    }
    xhri.onreadystatechange = function() {
      if(xhri.readyState == 4) {
        //console.log("inventory");
        let data = JSON.parse(xhri.response);
        let _data_length=0;
        for(var i = 0; i < data.length; i++) {
          if(data[i] != '0') {
            _data_length++;
            that._my_inventory.push(data[i]);
          }
        }
        if (_data_length > that._max_array_size) {
          that._max_array_size = _data_length;
          that._numbers = Array(that._max_array_size).fill().map((x,i)=>i);
         }
      }
    }
    xhrf.onreadystatechange = function() {
      if(xhrf.readyState == 4) {
        console.log("flagged");
        let data = JSON.parse(xhrf.response);
        let _data_length=0;
        for(var i = 0; i < data.length; i++) {
          if(data[i] != '0') {
            _data_length++;
            that._my_flagged.push(data[i]);
          }
        }
        console.log(that._my_flagged);
        if (_data_length > that._max_array_size) {
          that._max_array_size = _data_length;
          that._numbers = Array(that._max_array_size).fill().map((x,i)=>i);
         }
      }
    }
    xhrr.send(JSON.stringify({ from: localStorage.getItem('account')}));
    xhri.send(JSON.stringify({ from: localStorage.getItem('account')}));
    xhrf.send(JSON.stringify({ from: localStorage.getItem('account')}));
  }
  getItemMetaData(_id) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8000/getitemmetadata', false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send( JSON.stringify({ from: localStorage.getItem('account'),id: _id }));
    let raw_data = xhr.response;
    let data = JSON.parse(raw_data);
    return data;

  }
  flagItem(_id) {
    const that = this;
    console.log("flag called");
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8000/flagitem');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        that.getInventories();
      }
    }
    let result = { from: localStorage.getItem('account'), id: _id };
    console.log(result);
    //console.log(JSON.stringify(result));
    xhr.send(JSON.stringify(result));
  }
  transferItem(_id) {
    const that = this;
    let itemid = _id;
    let fromaddress = localStorage.getItem('account');
    let toaddress = this._chain[parseInt(this._chain_by_address[fromaddress]) + 1];
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8000/transferitem');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        alert(xhr.response);
        that.getInventories();
      }
    }
    xhr.send(JSON.stringify( { from: fromaddress, to: toaddress, id: itemid }));
  }
  confirmItem(_id) {
    const that = this;
    console.log("confirm called");
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8000/confirmitem');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        that.getInventories();
      }
    }
    let result = { from: localStorage.getItem('account'), id: _id };
    console.log(result);
    console.log(JSON.stringify(result));
    xhr.send(JSON.stringify(result));
  }
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('account');
    localStorage.removeItem('private_key');
    this.router.navigate(['/login'])
  }
  goToSearch(){
  }

  mostRecentlyAdded(){

  }

}
