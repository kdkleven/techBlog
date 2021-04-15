const router = require('express').Router();
const { Post, Comment, User } = require('../../models');
const withAuth = require('../../utils/auth');

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

//POST create new post
router.post('/create', withAuth, async (req, res) => {
  try {
    const postData = await Post.create(
      {
        title: req.body.title,
        description: req.body.description,
        user_id: req.session.user_id
      });
    const newPost = postData.get({ plain: true });
    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET render create post page
router.get('/create', withAuth, (req, res) => {
  if (!req.session.logged_in) {
    res.redirect('/login');
    return;
  }
  res.render('create', {
    logged_in: req.session.logged_in
  });
});

//GET post by ID
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
    var userPost;
    const posts = postData.get({ plain: true });

    if (posts.user_id === req.session.user_id) {
      userPost = true;
      res.render('post', {
        ...posts,
        userPost,
        logged_in: req.session.logged_in
      });
      return;
    }
    else {
      userPost = false;
      res.render('post', {
        ...posts,
        userPost,
        logged_in: req.session.logged_in
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET update post page
router.get('/update/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name', 'id'],
        }
      ],
    });
    const posts = postData.get({ plain: true });
    res
      .render(
        'update',
        {
          posts,
          logged_in: req.session.logged_in
        }
      );
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
      return res.status(404).json({ message: 'No post found with this id!' });
    }
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
