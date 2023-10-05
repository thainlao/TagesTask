async function fetchUsers() {
    try {
        const response = await fetch('http://jsonplaceholder.typicode.com/users');
        const usersData = await response.json();
        return usersData;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

async function fetchPosts(userId) {
    try {
        const response = await fetch(`http://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        const postsData = await response.json();
        return postsData;
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

async function fetchComments(postId) {
    try {
        const response = await fetch(`http://jsonplaceholder.typicode.com/posts/${postId}/comments`);
        const commentsData = await response.json();
        return commentsData;
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
}

async function loadUsers() {
    const userListDiv = document.getElementById('user-list');
    const usersData = await fetchUsers();

    if (usersData.length === 0) {
        userListDiv.innerHTML = '<p>Error loading data</p>';
        return;
    }

    const usersWithPostsAndComments = [];

    for (const user of usersData) {
        const postsData = await fetchPosts(user.id);
        user.posts = postsData.map(post => ({
            id: post.id,
            title: post.title,
            title_crop: post.title.length > 20 ? post.title.slice(0, 20) + '...' : post.title,
            body: post.body,
        }));

        if (user.name === "Ervin Howell") {
            for (const post of user.posts) {
                const comments = await fetchComments(post.id);
                post.comments = comments;
            }
        }

        usersWithPostsAndComments.push(user);
    }

    const formattedUsers = usersWithPostsAndComments.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        address: `${user.address.city}, ${user.address.street}, ${user.address.suite}`,
        website: `https://${user.website}`,
        company: user.company.name,
        posts: user.posts,
    }));

    userListDiv.innerHTML = '<pre>' + JSON.stringify(formattedUsers.slice(0, 10), null, 2) + '</pre>';
    console.log(formattedUsers)// решение
}

loadUsers();