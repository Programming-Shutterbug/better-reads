import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IUser } from '@nx-emma-indiv/shared/api';

@Component({
  selector: 'nx-emma-indiv',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {

  hidePassword = true; 
  subs: Subscription | null = null;
  submitted = false;
  loginError = false;
  userId: string | null = null;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, this.validEmail.bind(this),]),
    password: new FormControl(null, [Validators.required, this.validPassword.bind(this),]),
  });

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Abonneer op de observable die de gebruiker ophaalt uit de lokale opslag.
    this.subs = this.authService.getUserFromLocalStorage().subscribe((user: IUser | null) => {

        if (user) {
          console.log('User already logged in > to dashboard');
          // Navigeer naar het dashboard als de gebruiker al is ingelogd.
          this.router.navigate([`${this.userId}/dashboard`]);
        }

      });
        // Retrieve user ID from AuthService
        this.authService.currentUser$.subscribe({
          next: (user: IUser | null) => {
            if (user) {
              this.userId = user._id;
            }
          },
          error: (error) => {
            console.error('Error getting user information:', error);
          },
        });
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  onSubmit(): void {
    // Controleer of het formulier geldig is.
    if (this.loginForm.valid) {
      // Markeer het formulier als ingediend.
      this.submitted = true;

       // Haal e-mail en wachtwoord op uit het formulier.
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      // Roep de authService aan om in te loggen met de opgegeven e-mail en wachtwoord.
      this.authService
        .login(email, password)
        .subscribe(
          (user: IUser | null) => {

            // Als inloggen succesvol is (gebruikersobject ontvangen), navigeer naar het boekenlijst.
            if (user) {
              console.log('Logged in');
              this.router.navigate([`${this.userId}/dashboard`]);
            } else {
              // Inloggen mislukt
              this.loginError = true;
            }

            // Zet de submitted-flag terug naar false na de inlogpoging.
            this.submitted = false;
          },
          () => {
            // Fout bij inloggen
            this.loginError = true;

            // Zet de submitted-flag terug naar false na de inlogpoging.
            this.submitted = false;
          }
        );
    } else {
      // Als het formulier niet geldig is, markeer een fout in de console.
      this.submitted = false;
      console.error('loginForm invalid');
    }
  }

  validEmail(control: FormControl): { [s: string]: boolean } | null {
    const email = control.value;

    const regexp = /^[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+$/;
    return regexp.test(email) ? null : { invalidEmail: true };
  }

  validPassword(control: FormControl): { [s: string]: boolean } | null {
    const password = control.value;

    const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regexp.test(password) ? null : { invalidPassword: true };
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}