const router = require('express').Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

// Get all posts and JOIN with user data
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });
    if (!postData) {
      res.status(404).json({
          message: "No post found with this id"
      });
      return;
  }
    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('home', {
      posts,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET post by ID (when post is selected)
router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name']
        },
      ],
    });
    if (!postData) {
      res.status(404).json({
          message: "No post found with this id"
      });
      return;
  }
    const posts = postData.get({ plain: true });

    res.render('post', {
      posts,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
  const user = req.session.user_id;
  try {
    const userData = await User.findOne({ where: { id: req.session.user_id }});
    
    const userName = userData.get({ plain: true });
   
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name"]
        },
      ],
      attributes: ["id", "title", "description", "createdAt", "updatedAt"],
      where: {
        user_id: user,
      },
    });
    
    if (!postData) {   
      res.status(404).json({
        message: "No posts found",
      });
      return;
    }
      const posts = postData.map((post) => post.get({ plain: true }));
    
      res.render('dashboard', {
        posts,
        logged_in: req.session.logged_in,
        userName
      });
  }
   catch (err) {
  res.status(500).json(err);
}
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('login');
});

module.exports = router;

