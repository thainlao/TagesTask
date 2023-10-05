import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Comment } from './types/types';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchComments = async (postId: number): Promise<Comment[]> => {
    try {
      const response = await axios.get(`http://jsonplaceholder.typicode.com/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  useEffect(() => {
    axios.get('http://jsonplaceholder.typicode.com/users')
      .then(async (response) => {
        const usersData: User[] = response.data;
        const usersWithPostsAndComments = await Promise.all(usersData.map(async (user: User) => {
          const postsResponse = await axios.get(`http://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
          const postsData = postsResponse.data;
          user.posts = postsData.map((post: any) => ({
            id: post.id,
            title: post.title,
            title_crop: post.title.length > 20 ? post.title.slice(0, 20) + '...' : post.title,
            body: post.body,
          }));

          //отображение комментов 
          if (user.name === "Ervin Howell") {
            const postsWithComments = await Promise.all(user.posts.map(async (post: any) => {
              const comments = await fetchComments(post.id);
              return { ...post, comments };
            }));
            user.posts = postsWithComments;
          }

          return user;
        }));

        const formattedUsers: any = usersWithPostsAndComments.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          address: `${user.address.city}, ${user.address.street}, ${user.address.suite}`,
          website: `https://${user.website}`,
          company: user.company.name,
          posts: user.posts,
        }));

        setUsers(formattedUsers.slice(0, 10)); // вывод результата в state  
        console.log(formattedUsers.slice(0, 10))//Вывод результата в консоль
      })
      .catch((error) => {
        console.error('Error loading data:', error);
      });
  }, []);

  return (
    <div>
      <h1>TAGES</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
};

export default UserList;