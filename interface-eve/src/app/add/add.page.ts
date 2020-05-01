import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  constructor(private router: Router) { }
  _serial = ''; _type=''; _image=''; _description='';
  getUser() {
    return localStorage.getItem('user');
  }
  getAccount() {
    return localStorage.getItem('account');
  }
  ngOnInit() {
  }
  onUpdateSerial(event: Event) {
    this._serial = <HTMLInputElement>event.target.value;
  }
  onUpdateType(event: Event) {
    this._type = <HTMLInputElement>event.target.value;
  }
  onUpdateImage(event: Event) {
    this._image = <HTMLInputElement>event.target.value;
  }
  onUpdateDescription(event: Event) {
    this._description = <HTMLInputElement>event.target.value;
  }
  addItem() {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8000/createitem');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        alert(xhr.response);
      }
    }
    xhr.send(JSON.stringify({from: localStorage.getItem('account'), name: this._serial, type:this._type, image:this._image, description:this._description}));
  }
  isAdmin() {
    if((localStorage.getItem('user') == 'admin1')) { return true; }
    return false;
  }
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('account');
    localStorage.removeItem('private_key');
    this.router.navigate(['/login'])
  }
}
