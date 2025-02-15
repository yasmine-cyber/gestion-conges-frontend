import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';  
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, NgIf, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
email: string = ''; 
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const credentials = { email: this.email, password: this.password };

    this.authService.login(credentials).subscribe(
      (response:any) => {
        console.log('Connexion réussie :', response);
        // Stocke le token JWT dans le localStorage pour les futures requêtes
        const token = response.token; // Assure-toi que le backend envoie bien un token
        localStorage.setItem('jwt', token);

        
        const user = response.user;
        localStorage.setItem('user', JSON.stringify(user));

    
        if (user.role === 'admin') {
          this.router.navigate(['/admin']); 
        } else if (user.role === 'employee') {
          this.router.navigate(['/employee']); 
        }
      },
      (error:any) => {
        console.error('Erreur de connexion :', error);
        this.errorMessage = error.error.message || 'Échec de la connexion.';
      }
    );
  }

}
