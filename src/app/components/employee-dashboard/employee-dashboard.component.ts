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
    this.loadLeaveRequests();
  }

  loadLeaveRequests() {
    this.leaveService.getLeaveRequestsByUser().subscribe({
      next: (data) => {
        this.leaveRequests = data;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des demandes';
      }
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
        this.loadLeaveRequests();
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