//function to create new comment
const newCommentHandler = async function (event) {
    event.preventDefault();

  console.log("newcommentHandler!!!!");
    //variables
    const content = await document.querySelector('#comment-content').value.trim();
    console.log(content);
    const post_id = await document.querySelector('#comment-content').getAttribute("data-id");
    console.log(post_id);

    if (content) {
      //fetch
      const response = await fetch('/api/post/' + post_id + '/comment', {
        method: 'POST',
        body: JSON.stringify({ content: content, post_id: post_id }),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(response)
  
      if (response.ok) {
      
        document.location.reload();
      } else {
        alert('Failed to create a new comment');
      }
    }
  }
  
  //onclick for comment button
  document
    .querySelector('#commentBtn')
    .addEventListener('click', newCommentHandler)
  