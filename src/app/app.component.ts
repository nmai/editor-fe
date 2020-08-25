import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { FireService } from './services/fire.service';
import { AuthState } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'editor-fe';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  async ngOnInit() {
    let loginStatus = await this.authService.waitAuthDecision();
    if (loginStatus == AuthState.Authenticated)
      this.router.navigate(['/doc']);
  }
}
