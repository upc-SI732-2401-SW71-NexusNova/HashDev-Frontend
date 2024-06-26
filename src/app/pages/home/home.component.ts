import { Component, OnInit } from '@angular/core';
import { HashdevDataService } from "../../services/hashdev-data.service";
import { Post } from "../../models/post.model";
import { Router } from "@angular/router";
import { NgForOf, NgIf } from "@angular/common";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { SidebarComponent } from "../sidebar/sidebar.component";
import {Comentario} from "../../models/comment.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    SidebarComponent
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  commentForms: { [key: number]: FormGroup } = {};
  errorMessage: string = '';
  UserId: string = '';

  constructor(private fb: FormBuilder, private api: HashdevDataService, private router: Router) {}

  ngOnInit(): void {
    this.UserId = this.getUserIdFromSession();
    if (!this.UserId) {
      this.router.navigate(['/login']);
    }
    this.loadPosts();
  }

  getUserIdFromSession(): string {
    return localStorage.getItem('UserId') || '';
  }

  loadPosts(): void {
    this.api.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts.map(post => ({
          ...post,
          showCommentBox: false,
          comentarios: []
        }));
        this.initializeCommentForms();
        this.loadCommentsForPosts();
      },
      error: (err) => {
        console.error('Error loading posts:', err);
      }
    });
  }

  initializeCommentForms(): void {
    this.posts.forEach(post => {
      this.commentForms[post.Id] = this.fb.group({
        Content: ['', Validators.required]
      });
    });
  }

  loadCommentsForPosts(): void {
    this.posts.forEach(post => {
      this.api.getCommentsByPostId(post.Id).subscribe({
        next: (comentarios) => {
          post.comentarios = comentarios;
        },
        error: (err) => {
          console.error(`Error loading comments for post ${post.Id}:`, err);
        }
      });
    });
  }

  toggleCommentBox(post: Post): void {
    post.showCommentBox = !post.showCommentBox;
  }

  onSubmit(post: Post): void {
    if (this.commentForms[post.Id].invalid) {
      return;
    }

    const newComentario: Comentario = {
      Id: 0,
      Content: this.commentForms[post.Id].value.Content,
      UserId: this.UserId,
      PostId: post.Id
    };

    this.api.addComment(newComentario).subscribe({
      next: (comentario) => {
        post.comentarios.push(comentario);
        this.commentForms[post.Id].reset();
      },
      error: (err) => {
        console.error('Error adding comment:', err);
      }
    });
  }
}
