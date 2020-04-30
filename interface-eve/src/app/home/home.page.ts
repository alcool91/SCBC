import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
text ='default text';

  constructor() {
  }
  _my_received=[]; _my_inventory=[]; _my_flagged=[];
  _max_array_size = 0; _numbers=[];
  onChangeText(){
    this.text = 'Changed!';
  }
  isAdmin() {
    if((localStorage.getItem('user') == 'admin1')) { return true; }
    return false;
  }
  ngAfterViewInit() {
    console.log("AFTER VIEW");
    this.getInventories();
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
        console.log("received");
        let data = JSON.parse(xhrr.response);
        if (data.length > that._max_array_size) {
          that._max_array_size = data.length;
          that._numbers = Array(that._max_array_size).fill().map((x,i)=>i);
         }
        for(var i = 0; i < data.length; i++) {
          that._my_received.push(data[i]);
        }
      }
    }
    xhri.onreadystatechange = function() {
      if(xhri.readyState == 4) {
        console.log("FUNCTION CALLED");
        let data = JSON.parse(xhri.response);
        console.log(data);
        if (data.length > that._max_array_size) {
          that._max_array_size = data.length;
          that._numbers = Array(that._max_array_size).fill().map((x,i)=>i);
         }
        for(var i = 0; i < data.length; i++) {
          that._my_inventory.push(data[i]);
          console.log("inventory");
          console.log(that._my_inventory)
        }
      }
    }
    xhrf.onreadystatechange = function() {
      if(xhrf.readyState == 4) {
        let data = JSON.parse(xhrf.response);
        if (data.length > that._max_array_size) {
          that._max_array_size = data.length;
          that._numbers = Array(that._max_array_size).fill().map((x,i)=>i);
         }
        for(var i = 0; i < data.length; i++) {
          that._my_flagged.push(data[i]);
        }
      }
    }
    xhrr.send();
    xhri.send();
    xhrf.send();
  }
  getItemMetaData(_id) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8000/getitemmetadata', false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send( JSON.stringify({ id: _id }));
    let raw_data = xhr.response;
    let data = JSON.parse(raw_data);
    return data;

  }
  goToSearch(){
  }

  mostRecentlyAdded(){

  }

}
