//function to create a new post
const newPostHandler = async (event) => {
    event.preventDefault();
  
    // variables
    const title = document.querySelector('#post-title').value.trim();
    const description = document.querySelector('#post-desc').value.trim();
  
    console.log(title);
  // fetch
      const response = await fetch(`/api/post/createPost`, {
        method: 'POST',
        body: JSON.stringify({
          title, description
        }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace("/myPosts");
      } else {
        alert(response.statusText);
      }
    
  };
  
  //on click event for new post
  document.querySelector('#create-post').addEventListener('click', newPostHandler);
  