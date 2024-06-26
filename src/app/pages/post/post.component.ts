import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { Router } from "@angular/router";
import { HashdevDataService } from "../../services/hashdev-data.service";
import { Post } from "../../models/post.model";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {NgIf} from "@angular/common"; // Asegúrate de que la ruta del modelo sea correcta

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SidebarComponent,
    NgIf
  ],
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  PostForm: FormGroup;
  errorMessage: string = '';
  UserId: string = '';

  constructor(private fb: FormBuilder, private api: HashdevDataService, private router: Router) {
    this.PostForm = this.fb.group({
      Content: ['', Validators.required],
      ImageUrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.UserId = this.getUserIdFromSession();
    if (!this.UserId) {
      this.router.navigate(['/login']);
    }
  }

  getUserIdFromSession(): string {
    return localStorage.getItem('UserId') || '';
  }

  onSubmit(): void {
    if (this.PostForm.valid) {
      const formData = this.PostForm.value;
      const post: { Content: any; UserId: string; ImageUrl: any; Id: number } = {
        Id: 0, // This should be set by the server, typically handled automatically
        Content: formData.Content,
        ImageUrl: formData.ImageUrl,

        UserId: this.UserId
      };

      this.api.createPost(post).subscribe({
        next: () => {
          this.errorMessage = '';
          this.PostForm.reset(); // Optionally reset the form after successful submission
          this.router.navigate(['/home']); // Navigate to posts list or wherever appropriate
        },
        error: (err) => {
          this.errorMessage = 'Failed to create post. Please try again later.';
          console.error('Error creating post:', err);
        }
      });
    } else {
      this.errorMessage = 'Form is not valid';
    }
  }
}
