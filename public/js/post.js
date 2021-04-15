

 //function to delete a post or give. 
 const deleteFormHandler = async (event) => {
    event.preventDefault();
    // variable
    const post_id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
    //fetch
    if (post_id) {
      const response = await fetch(`/api/post/${post_id}`, {
        method: 'DELETE',
        body: JSON.stringify({
          post_id
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        document.location.replace("/dashboard");
        alert("Your post has been deleted!");
      } else {
        alert(response.statusText);
      }
    }
  };

//calls delete
document
.querySelector('#dPost').addEventListener('click', deleteFormHandler);