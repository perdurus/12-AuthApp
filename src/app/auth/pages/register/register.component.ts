import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from "sweetalert2";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent {

  miFormulario: FormGroup = this.fb.group({
    name: ['Sergio', [Validators.required]],
    email: ['test5@test.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
  });


  constructor(private fb: FormBuilder, private router:Router, private authService:AuthService) { }

  register(){
    console.log(this.miFormulario.value);
    
    const {name, email, password} = this.miFormulario.value;

    this.authService.registro(name, email, password). 
        subscribe(ok =>{
          console.log('ok: ', ok);
          if (ok === true){
             this.router.navigateByUrl('/auth');
          }else{
            Swal.fire('Error', ok, 'error');
          }
        })
  }

}
