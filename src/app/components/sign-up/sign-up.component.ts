import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { AuthService } from '@app/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  constructor(private authService: AuthService, private router: Router) {}
  first_name: string = '';
  last_name: string = '';
  email: string = '';
  role: string = 'employee'; 
  password: string = '';
  password_confirmation: string = '';

 

  onSubmit() {
    
    if (this.password !== this.password_confirmation) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    const user = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      role: this.role,
      password: this.password,
      password_confirmation: this.password_confirmation
    };
    this.authService.signUp(user).subscribe(
      (response:any) => {
        console.log('Inscription réussie!', response);
        this.router.navigate(['/sign-in']); 
      },
      (error:any) => {
        console.error('Erreur lors de l\'inscription:', error);
      }
    );
  }



}
