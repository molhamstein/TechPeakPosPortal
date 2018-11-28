import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
// import { PersistenceModule } from 'angular-persistence';

// import { PersistenceService } from 'angular-persistence';



@Injectable()
export class LoginService {
  isLogIn;
  userId;
  token;
  userName
  type;
  constructor(private cookieService: CookieService, private router: Router) {
    if (this.isLoginCook()) {
      this.isLogIn = true;
    }
    else {
      this.isLogIn = false;
    }
    if (this.isLogIn) {
      this.init();
    }
  }

  init() {
    this.userId = this.cookieService.get("userId");
    this.token = this.cookieService.get("token");
    this.userName = this.cookieService.get("userName");
    this.type = this.cookieService.get("type");
  }

  isLogin() {
    return this.isLogIn;
  }

  getUserId() {
    if (this.userId != "")
      return this.userId;
  }

  getToken() {
    return this.token;
  }

  getuserName() {
    return this.userName;
  }

  getType() {
    return this.type;
  }


  logIn(data) {
    this.isLogIn = true;
    this.logInCook(data);
    this.init();
  }

  logout() {
    this.cookieService.set('isRemember', "");
    this.isLogIn = false;
    this.logoutCook();
    this.router.navigate(["/login"]);
  }


  setAvatar(newAvatar) {
    this.setAvatarCook(newAvatar);
  }



  isLoginCook() {
    if (this.cookieService.get('userId') == null ||this.cookieService.get('userId') == "" ) {
      return false;
    }
    else {
      return true;
    }
  }

  logInCook(data) {
    this.cookieService.set('userId', data.userId);
    this.cookieService.set('token', data.id);
    this.cookieService.set('userName', data.user.username);
    this.cookieService.set('role', 'Seller');
    this.cookieService.set('type', data.location.type);
    this.router.navigate(["/home"]);
  }

  getRole() {
    return this.cookieService.get('role');
  }

  logoutCook() {
    this.cookieService.delete('userId');
    this.cookieService.delete('token');
    this.cookieService.delete('userName');
    this.cookieService.delete('role');
    this.cookieService.delete('type');

  }


  setAvatarCook(newAvatar) {
    this.cookieService.set('dalalAvatar', newAvatar);
  }
}
