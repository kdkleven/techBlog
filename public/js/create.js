//function to create a new post
const newPostHandler = async (event) => {
    event.preventDefault();
  
    // variables
    const title = document.querySelector('#post-title').value.trim();
    const description = document.querySelector('#post-desc').value.trim();

  // fetch
  if(title) {
      const response = await fetch(`/api/post/create`, {
        method: 'POST',
        body: JSON.stringify({ title: title, description: description }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/dashboard');
        
      } else {
        alert(response.statusText);
      }
    }
  };
  
  //on click event for new post
  document.querySelector('#create-post').addEventListener('click', newPostHandler);
  