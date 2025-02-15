import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router';  // Importer RouterModule

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout().subscribe(
      () => {
        console.log('Déconnexion réussie');
        localStorage.removeItem('user'); // Supprimer l'utilisateur localement
        this.router.navigate(['/']); // Retour à la page d'accueil
      },
      (error) => {
        console.error('Erreur lors de la déconnexion :', error);
      }
    );
  }

}
