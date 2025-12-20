import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../../services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  passwordVisible = false;

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private router: Router,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    if (this.appService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  submitForm(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const { username, password } = this.loginForm.value;
      const lowercaseUsername = username.toLowerCase();

      this.appService.login(lowercaseUsername, password).subscribe({
        next: (response) => {
          sessionStorage.setItem('accountAccessToken', response.token);
          sessionStorage.setItem('currentUser', JSON.stringify(response.user));
          this.message.success('Login successful!');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          this.message.error(error.error?.message || 'Login failed');
        }
      });
    } else {
      Object.values(this.loginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
