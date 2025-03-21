import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirm-login',
  imports: [],
  styleUrl: './confirm-login.component.scss',
  template: `
    <p>logging you in...</p>
  `,
})
export class ConfirmLoginComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  private confirmationCode: string | null = null;

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate([ '/' ]);
      return;
    }

    this.confirmationCode = this.route.snapshot.paramMap.get('confirmationCode');

    if (!this.confirmationCode) {
      this.router.navigate([ '/login' ]);
      return;
    }

    this.authService
      .confirmLogin(this.confirmationCode)
      .then(() => this.router.navigate([ '/' ]))
      .catch(() => this.router.navigate([ '/login' ]))
  }
}
