
//function to update a post. 
const updateFormHandler = async (event) => {
    event.preventDefault();
  
    // variables
    const title = document.querySelector('#changeTitle').value.trim();
    const description = document.querySelector('#changeContent').value.trim();
    const post_id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
    // fetch
    const response = await fetch(`/api/post/:id'`, {
      method: 'PUT',
      body: JSON.stringify({
        title, description, post_id
      }),
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      alert(response.statusText);
    }
  
  };
  //function to delete a post or give. 
  const deleteFormHandler = async (event) => {
    event.preventDefault();
    // variable
    const post_id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
    //fetch
    if (post_id) {
      const response = await fetch('/api/post/:id', {
        method: 'DELETE',
        body: JSON.stringify({
          post_id
        }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace("/dashboard");
      } else {
        alert(response.statusText);
      }
    }
  };
  
  //calls update
  document
    .querySelector('#uPost').addEventListener('click', updateFormHandler);
  //calls delete
  document
    .querySelector('#dPost').addEventListener('click', deleteFormHandler);