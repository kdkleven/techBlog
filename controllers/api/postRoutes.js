const router = require('express').Router();
const { Post, Comment, User } = require('../../models');
const withAuth = require('../../utils/auth');

//CREATE new post
router.post('/createPost', withAuth, async (req, res) => {
  console.log("I'M HERE TO CREATE A POST");
  try {
      const newPost = await Post.create(
          {
          title: req.body.title,
          description: req.body.description,
          user_id: req.session.user_id
      });
      res.status(200).json(newPost);
      console.log("New Post Created");
      console.log(newPost);
  } catch (err) {
      res.status(500).json(err);
  }
});


//Render create post page
router.get('/createForm', withAuth, (req, res) => {
  console.log("You've reached /createForm");
  res.render('createPost', {
    logged_in: req.session.logged_in
  })
});

//Render edit post page
router.get('/editPost', withAuth, (req, res) => {
  console.log("You've reached /editPost");
  res.render('editPost', {
    logged_in: req.session.logged_in
  })
});


//get post by ID
router.get('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
          {
              model: User,
              attributes: ['name', 'id'],
          },

          {
              model: Comment,
              attributes: ['content', 'createdAt', 'user_id'],
              include: {
                  model: User, 
                  attributes: ['name', 'id'],
              }
          },
      ],
    });

    const posts = postData.get({ plain: true });

    res.render('post', {
      ...posts,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
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
router.post('/:id/comment', withAuth, async (req, res) => {
  try {
      const newComment = await Comment.create({
          content: req.body.content,
          post_id: req.body.post_id,
          user_id: req.session.user_id
      });
      res.status(200).json(newComment);
  } catch (err) {
      res.status(400).json(err);
  }
});

module.exports = router;
