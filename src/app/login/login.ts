import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  http=inject(HttpClient)
  newlog:any={
    UserName:"",
    PasswordHash:""
  }
  
  login(){
    console.log(this.newlog)
    this.http.post("http://localhost:5200/api/Login/Login",this.newlog).subscribe((res:any)=>
      {
      console.log(res);
      alert("Token: " + res.token + "\nUser: " + res.username + "\nRole: " + res.role);
    }
  )}
}
