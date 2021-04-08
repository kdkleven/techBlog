const router = require('express').Router();
const { Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

//POST create post
router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

//Display individual post
router.get('/:id', (req, res) => {
  res.render('post', {
      loggedIn: req.session.logged_in
  });
});

//DELETE post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(PostData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//PUT update post
router.put('/:id', async (req, res) => {
  try {
      const postData = await Post.update({
          title: req.body.title,
          description: req.body.description
      }, {
          where: {
              id: req.body.post_id,
          }
      });
      if (!postData) {
          res.status(404).json({ message: "No posts found with that ID!" });
      }
      res.status(200).json(postData);
  } catch (err) {
      res.status(500).json(err);
  }
});

//POST create a comment
router.post("/comment", async (req, res) => {
  try {
    console.log("Post route try");
      const newComment = await Comment.create({
          content: req.body.content,
          post_id: req.body.post_id
          //user_id: req.session.user_id
      });
      res.status(200).json(newComment);
      res.render('post');
  } catch (err) {
      res.status(400).json(err);
  }
});

module.exports = router;
