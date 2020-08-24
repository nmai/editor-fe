import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { FireService } from './services/fire.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'editor-fe';

  constructor(
    private fireService: FireService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.fireService.initialize()
    this.authService.authenticate();
  }
}
