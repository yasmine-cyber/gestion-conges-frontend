import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LeaveService } from '@app/services/leave.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NgFor, RouterModule,FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  leaveRequests: any[] = [];
  errorMessage: string = ''; // Pour afficher des erreurs
  selectedRequest: any = null;
  commentaire: string = '';
  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.loadLeaveRequests();
   
  }
  loadLeaveRequests() {
    this.leaveService.getAllLeaveRequests().subscribe({
      next: (data) => {
        this.leaveRequests = data.filter(req => req.status !== 'canceled');
        this.errorMessage = '';
      },
      error: (error) => this.handleError(error, 'chargement des demandes')
    });
  }
 
  // Méthode pour initier l'approbation
  initApprove(request: any) {
    this.selectedRequest = request;
  }


  // Méthode pour initier le rejet
  initReject(request: any) {
    this.selectedRequest = request;
  }

  // Méthode de confirmation commune
  confirmAction(actionType: 'approve'|'reject') {
    if (!this.selectedRequest || !this.commentaire) {
      this.errorMessage = 'Veuillez saisir un commentaire';
      return;
    }

    const request$ = actionType === 'approve' 
      ? this.leaveService.approveLeaveRequest(this.selectedRequest.id, this.commentaire)
      : this.leaveService.rejectLeaveRequest(this.selectedRequest.id, this.commentaire);

    request$.subscribe({
      next: () => {
        this.loadLeaveRequests();
        this.resetSelection();
      },
      error: (error) => this.handleError(error, actionType)
    });
  }

  // Méthode d'annulation
  cancelAction() {
    this.resetSelection();
  }

  private resetSelection() {
    this.selectedRequest = null;
    this.commentaire = '';
    this.errorMessage = '';
  }

  private handleError(error: any, action: string) {
    console.error(`Erreur ${action}`, error);
    this.errorMessage = error.error?.message || `Erreur lors de ${action}`;
  }
}

