import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
    { path: '', component: HomeComponent }, // Page d'accueil
    { path: 'sign-up', component: SignUpComponent }, // Page Sign Up
    { path: 'sign-in', component: SignInComponent }, // Page Sign In
    { path: 'employee', component: EmployeeDashboardComponent }, // Dashboard Employé
    { path: 'admin', component: AdminDashboardComponent }, // Dashboard Admin
];
