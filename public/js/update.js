
//function to update a post. 
const updateFormHandler = async (event) => {
  event.preventDefault();

  // variables
  const title = document.querySelector('#changeTitle').value.trim();
  const description = document.querySelector('#changeDescription').value.trim();
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
    window.history.back();
  } else {
    alert(response.statusText);
  }

};


//calls update
document
  .querySelector('#uPost').addEventListener('click', updateFormHandler);
