import { MaterialModule } from '../material/material-module';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  username: string | null = null;
  role: string | null = null;

  roles: any[] = [];
  users: any[] = [];

  isSidebarOpen = true;
  selectedRole: number | null = null;
  selectedUser: string = "";

  permissionsForUser: string[] = [];
  permissions = { bank: false, branch: false, geography: false };

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.username = localStorage.getItem('User');
      this.role = localStorage.getItem('Role');

      this.getRoles();

      // fetch permissions for non-admin users
      if (this.role && this.role.toLowerCase() !== 'admin') {
        this.getPermissionsByUser(this.username!);
      }
    }
  }

  // --- Roles ---
  getRoles() {
    this.http.get<any[]>("http://localhost:5200/api/Role/FetchAllRoles").subscribe({
      next: (roles) => {
        console.log("Roles:", roles);
        this.roles = roles;
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  // --- Users by Role ---
  onRoleChange(roleId: number) {
    this.http.get<any[]>(`http://localhost:5200/api/Permission/GetUsersByRole/${roleId}`).subscribe({
      next: (users) => {
        this.users = users;
        console.log("Users by role:", users);
      },
      error: (err) => console.error(err)
    });
  }

  // --- Assign Permissions ---
  assignPermissions() {
    if (!this.selectedUser) {
      alert("Please select a user");
      return;
    }

    const selectedPermissions: string[] = [];
    if (this.permissions.bank) selectedPermissions.push("Bank");
    if (this.permissions.branch) selectedPermissions.push("Branch");
    if (this.permissions.geography) selectedPermissions.push("Geography");

    if (selectedPermissions.length === 0) {
      alert("Please select at least one permission");
      return;
    }

    const payload = {
      UserName: this.selectedUser,
      roleId: this.selectedRole,
      permissions: selectedPermissions
    };

    this.http.post("http://localhost:5200/api/Permission/assignPermissions", payload).subscribe({
      next: (res) => {
        console.log("Assigned successfully", res);
        alert("Permissions assigned!");

        // refresh permissions if updating own account
        if (this.selectedUser === this.username) {
          this.getPermissionsByUser(this.username!);
        }
      },
      error: (err) => console.error(err)
    });
  }

  // --- Fetch Permissions for User ---
  getPermissionsByUser(UserName: string) {
    this.http.get<string[]>(`http://localhost:5200/api/Permission/GetPermissionsByUser/${UserName}`).subscribe({
      next: (permissions) => {
        console.log("Permissions for user:", permissions);
        this.permissionsForUser = permissions.map(p => p.toLowerCase()); // normalize case
      },
      error: (err) => console.error(err)
    });
  }

  // --- Check Permission ---
  hasPermission(feature: string): boolean {
    if (this.role && this.role.toLowerCase() === "admin") {
      return true; 
    }
    return this.permissionsForUser.includes(feature.toLowerCase());
  }

  // --- Admin Check ---
  isAdmin(): boolean {
    return this.role?.toLowerCase() === 'admin';
  }

  // --- Logout ---
  logout() {
    localStorage.removeItem('Role');
    localStorage.removeItem('Token');
    localStorage.removeItem('User');
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
