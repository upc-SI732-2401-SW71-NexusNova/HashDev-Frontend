import {Comentario} from "./comment.model";

export interface Post{
  Id: number,
  Content: string,
  ImageUrl: string,
  UserId: string,
  author: string,
  authorProfilePictureUrl: string,
  showCommentBox: boolean;
  comentarios: Comentario[];
  newComentario: string;
}
