import { Component, OnInit } from '@angular/core';
import { LeaveService } from '@app/services/leave.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  startDate: string = '';
  endDate: string = '';
  cause: string = 'vacation';
  leaveRequests: any[] = [];
  errorMessage: string = '';
  isSubmitting: boolean = false; // Ajouté
  successMessage: string = ''; // Ajouté

  constructor(private leaveService: LeaveService) {}

  ngOnInit() {
    this.loadUserLeaveRequests();
   
    
  }
  loadUserLeaveRequests() {
  
  
    this.leaveService.getLeaveRequestsByUser().subscribe({
      next: (data) => {

        const notifiedRequests = new Set(JSON.parse(sessionStorage.getItem('notifiedRequests') || '[]'));
  
        // Mettre à jour la liste des demandes
        this.leaveRequests = data;
  
        // Filtrer uniquement les nouvelles demandes (non encore notifiées)
        const newRequests = this.leaveRequests.filter(request => !notifiedRequests.has(request.id));
  
        // Afficher une alerte uniquement pour les nouvelles demandes
        newRequests.forEach(request => {
          if (request.status === 'approved') {
            alert("🎉 Félicitations ! Votre nouvelle demande a été acceptée !");
          } else if (request.status === 'rejected') {
            alert("❌ Désolé, votre nouvelle demande a été refusée.");
          }
          // Ajouter l'ID de cette demande dans la liste des demandes notifiées
          notifiedRequests.add(request.id);
        });
  
        // Sauvegarder la nouvelle liste des demandes notifiées
        sessionStorage.setItem('notifiedRequests', JSON.stringify([...notifiedRequests]));
      },
      error: (error) => console.error("Erreur chargement demandes", error),
    
    });
  }
  
  
  


  cancelRequest(id: number) {
    this.leaveService.cancelLeaveRequest(id).subscribe({
      next: (updatedRequest) => {
        alert("Demande annulée avec succès !");
        // Mettre à jour la liste localement
        this.leaveRequests = this.leaveRequests.map(req => 
          req.id === id ? updatedRequest : req
        );
      },
      error: (err) => alert(err.message || "Erreur lors de l'annulation")
    });
  }
  

  submitLeaveRequest() {
    this.isSubmitting = true; // Activation du state de soumission
    this.errorMessage = '';
    this.successMessage = '';

    const leaveRequest = {
      start_date: this.startDate,
      end_date: this.endDate,
      cause: this.cause,
      status: 'pending'
    };
   
    this.leaveService.createLeaveRequest(leaveRequest).subscribe({
      next: () => {
        this.successMessage = 'Demande soumise avec succès!';
        this.startDate = '';
        this.endDate = '';
        this.cause = 'vacation';
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors de la soumission';
      },
      complete: () => {
        this.isSubmitting = false; // Désactivation du state
      }
    });
  }
}