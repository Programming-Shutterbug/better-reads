import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../user/user.service';


@Component({
  selector: 'nx-emma-indiv',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})

export class RegisterComponent implements OnInit, OnDestroy {
  
  registerForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, this.validEmail.bind(this),]),
    password: new FormControl(null, [Validators.required, this.validPassword.bind(this),]),
  });

  subs: Subscription | null = null;
  hidePassword = true; 
  loginError = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      naam:  new FormControl(null, [Validators.required]),
      geboortedatum:  new FormControl(null, [Validators.required]),
      straatnaam: new FormControl(null, [Validators.required]),
      huisnummer:  new FormControl(null, [Validators.required]),
      stad:  new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, this.validEmail.bind(this),]),
      password: new FormControl(null, [Validators.required, this.validPassword.bind(this),]),
    });
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.registerForm?.valid) {
      this.userService.create(this.registerForm.value).subscribe((user) => {
        console.log('Registration succeeded');
        this.router.navigate(['/user/login'], { relativeTo: this.route });
      });
    } else {
      this.loginError = true;
      console.error('Registration returned null user');
    }
  }

  validEmail(control: FormControl): { [key: string]: boolean } | null {
    const email = control.value;
    const regexp = /^[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+$/;
    return regexp.test(email) ? null : { invalidEmail: true };
  }

  validPassword(control: FormControl): { [key: string]: boolean } | null {
    const password = control.value;
    const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regexp.test(password) ? null : { invalidPassword: true };
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}