import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material-module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [FormsModule, CommonModule, MaterialModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  http=inject(HttpClient)
  newlog:any={
    UserName:"",
    PasswordHash:""
  }
  
  constructor(private router:Router){}
  login(){
    console.log(this.newlog)
    this.http.post("http://localhost:5200/api/Login/Login",this.newlog).subscribe((res:any)=>
      {
      console.log(res);
      localStorage.setItem("Role",res.role);
      localStorage.setItem("User",res.username);
      this.router.navigate(['/dashboard'])
      // alert("Token: " + res.token + "\nUser: " + res.username + "\nRole: " + res.role);
    }
  )}

  }
