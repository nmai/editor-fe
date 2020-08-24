import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { FireService } from './fire.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  get isAuthenticated(): boolean { return false; }

  constructor(
    private fireService: FireService,
  ) { }

  async authenticate() {
    await this.fireService.login();
  }
}
