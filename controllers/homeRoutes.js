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
router.get('/myPosts', withAuth, async (req, res) => {
  const user = req.session.user_id;
  console.log("This is REQ.SESSION", req.session);
  try {
      const postData = await Post.findAll({
          include: [
              {
                  model: User,
                  attributes: ["name"]
              },
          ],
          attributes: ["id", "title", "description", "createdAt", "updatedAt" ],
          where: {
              user_id: user,
          },
      });

      if (!postData) {
          res.status(404).json({
              message: "No post found with this id"
          });
          return;
      }
      const posts = postData.map((post) => post.get({ plain: true }));
      console.log("POSTS",posts[0].user.name);
      const name = posts[0].user.name;
      res.render('myPosts', {
          posts,
          logged_in: req.session.logged_in,
          name
      });

  } catch (err) {
      res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/myPosts');
    return;
  }
  res.render('login');
});

module.exports = router;
