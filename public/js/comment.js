//function to create new comment
const newCommentHandler = async function (event) {
    event.preventDefault();
    //variables
    const content = await document.querySelector('#comment-content').value.trim();
    const post_id = await document.querySelector('#comment-content').getAttribute("data-id");

    if (content) {
      //fetch
      const response = await fetch('/api/post/' + post_id + '/comment', {
        method: 'POST',
        body: JSON.stringify({ content: content, post_id: post_id }),
        headers: {
          'Content-Type': 'application/json',
        }
      });  
      if (response.ok) {
        document.location.replace(`/api/post/${post_id}`);
      } else {
        alert('Failed to create a new comment');
      }
    }
  };
  
  //onclick for comment button
  document
    .querySelector('#commentBtn')
    .addEventListener('click', newCommentHandler);
  