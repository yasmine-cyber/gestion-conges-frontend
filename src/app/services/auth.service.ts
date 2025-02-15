import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) {}

  signUp(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, { user }, { withCredentials: true }).pipe(
      tap(() => this.router.navigate(['/sign-in'])),
      catchError(this.handleError)
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/sign_in`, { user: credentials }, { withCredentials: true }).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('jwt', res.token); // ✅ Stockage sécurisé du JWT
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/sign_out`, { withCredentials: true }).pipe(
      tap(() => localStorage.removeItem('jwt')),
      catchError(this.handleError)
    );
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  private handleError(error: any): Observable<never> {
    console.error('Erreur:', error);
    return throwError(() => error.error || 'Erreur serveur');
  }
}



