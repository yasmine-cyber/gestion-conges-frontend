import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'http://localhost:3000/leave_requests';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  // Crée les headers avec le JWT
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllLeaveRequests(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { 
      headers: this.getAuthHeaders() 
    });
  }

  getLeaveRequestsByUser(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  createLeaveRequest(leaveRequest: any): Observable<any> {
    return this.http.post(
      this.apiUrl, 
      { leave_request: leaveRequest }, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  approveLeaveRequest(id: number, commentaire: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${id}/approve`,
      { commentaire },
      { headers: this.getAuthHeaders() }
    );
  }

  rejectLeaveRequest(id: number, commentaire: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${id}/reject`,
      { commentaire },
      { headers: this.getAuthHeaders() }
    );
  }
  cancelLeaveRequest(id: number): Observable<any> {
  return this.http.patch(`${this.apiUrl}/${id}/cancel`, {}, { headers: this.getAuthHeaders() });
}


  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Erreur LeaveService:', error);

    if (error.status === 401) {
      this.authService.logout().subscribe(() => {
        this.router.navigate(['/sign-in']);
      });
    }

    return throwError(() => ({
      message: error.error?.error || 'Erreur serveur',
      status: error.status
    }));
  }
}