import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {

  constructor() { }


  getUser() {
    return localStorage.getItem('user');
  }
  getAccount() {
    return localStorage.getItem('account');
  }
  ngOnInit() {
  }
  isAdmin() {
    if((localStorage.getItem('user') == 'admin1')) { return true; }
    return false;
  }
}
