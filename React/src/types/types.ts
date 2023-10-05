export interface Post {
    id: number;
    title: string;
    title_crop: string;
    body: string
    comments: Comment[]
}

export interface Comment {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    address: {
      street: string;
      suite: string;
      city: string;
    };
    website: string;
    company: { name: string };
    posts: any[];
}