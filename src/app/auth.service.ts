import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // tslint:disable-next-line: variable-name
  constructor(public http: HttpClient , private router: Router) { }
  private token: string;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();


  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  gettoken()
  {
    return this.token;
  }

  regsiter(email: string, pass: string , username: string , displayname: string , gender: string , img: File)
  {
    const Data = new FormData();

    Data.append('username', username);
    Data.append('displayname', displayname);
    Data.append('email', email);
    Data.append('password', pass);
    Data.append('gender', gender);
    Data.append('image', img);

    this.http.post('http://localhost:3000/users/auth/register', Data).subscribe(result => {
    this.router.navigate(['login']);
    });
  }


  login(username, pass)
{
  const data = {username: username , password: pass};
  this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/users/auth/login', data).subscribe(res => {
  const expiresInDuration = res.expiresIn;
  this.isAuthenticated = true;
  this.authStatusListener.next(true);
  const now = new Date();
  const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
  this.saveAuthData(res.token, expirationDate);
  console.log(expiresInDuration);
  this.router.navigate(['/']);
  });
}

logout() {
  this.token = null;
  this.isAuthenticated = false;
  this.authStatusListener.next(false);
  this.clearAuthData();
  this.router.navigate(['/']);
}

autoAuthUser() {
  const authInformation = this.getAuthData();
  if (!authInformation) {
    return;
  }
  const now = new Date();
  const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
  if (expiresIn > 0) {
    this.token = authInformation.token;
    this.isAuthenticated = true;
    this.authStatusListener.next(true);
  }
}



private saveAuthData(token: string, expirationDate: Date) {
  localStorage.setItem('token', token);
  localStorage.setItem('expiration', expirationDate.toISOString());
}

private clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('expiration');
}

private getAuthData() {
  const token = localStorage.getItem('token');
  const expirationDate = localStorage.getItem('expiration');
  if (!token || !expirationDate) {
    return;
  }
  return {
    token: token,
    expirationDate: new Date(expirationDate)
  };
}


}
