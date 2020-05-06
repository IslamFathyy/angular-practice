import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(public authService: AuthService) { }

  public img: File;

  public form: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      username : new FormControl(null, { validators: Validators.required}),
      displayname : new FormControl(null, { validators: Validators.required}),
      email : new FormControl(null, { validators: Validators.required}),
      password : new FormControl(null, { validators: Validators.required}),
      gender : new FormControl(null, { validators: Validators.required}),
      image : new FormControl(null, { validators: Validators.required}),

    });
  }

  onSignup(){
    if (this.form.valid)
    {
      console.log('from ts');
      this.authService.regsiter(this.form.value.email, this.form.value.password, this.form.value.username, this.form.value.displayname, this.form.value.gender,this.form.value.image);
    }
  }

  onupload(event)
  {
    if ( event.target.files.length > 0)
    {
      const file = (event.target as HTMLInputElement).files[0];
      this.form.patchValue({image: file});
      this.form.get('image').updateValueAndValidity();
      console.log(this.form);
    }
  }
}
