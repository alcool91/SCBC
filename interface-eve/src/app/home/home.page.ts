import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
text ='default text';

  constructor() {}

  onChangeText(){
    this.text = 'Changed!';
  }
  isAdmin() {
    if((localStorage.getItem('user') == 'admin1')) { return true; }
    return false;
  }
  goToSearch(){
  }

  mostRecentlyAdded(){

  }

}
