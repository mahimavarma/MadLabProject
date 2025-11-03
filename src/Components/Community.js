import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  TextField,
  Button,
  Avatar,
  Divider,
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Paper,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Comment,
  Share,
  Add,
  PhotoCamera,
  Send,
  Search,
} from '@mui/icons-material';
import { useAuth } from './AuthContext';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { toast } from 'react-toastify';

const Community = () => {
  const { currentUser } = useAuth();
  
  // Dummy posts for initial display
  const dummyPosts = [
    {
      id: 'dummy1',
      title: '🍕 Homemade Margherita Pizza',
      description: 'Just made this amazing pizza from scratch! The dough was perfect and the basil from my garden made it even more special. Nothing beats homemade pizza on a Sunday afternoon!',
      recipe: '1. Make pizza dough and let it rise for 2 hours\n2. Roll out the dough and add tomato sauce\n3. Add fresh mozzarella and basil leaves\n4. Bake at 475°F for 10-12 minutes until golden\n5. Drizzle with olive oil and enjoy!',
      ingredients: 'pizza dough, tomato sauce, fresh mozzarella, basil, olive oil, salt, pepper',
      imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      authorId: 'user1',
      authorName: 'Chef Marco',
      authorEmail: 'marco@example.com',
      likes: ['user1', 'user2', 'user3'],
      comments: [
        {
          id: 'c1',
          text: 'This looks absolutely delicious! Can you share your dough recipe?',
          authorId: 'user2',
          authorName: 'Sarah Cook',
          createdAt: '2024-03-10T10:30:00Z'
        },
        {
          id: 'c2',
          text: 'I tried this recipe and it turned out amazing! Thanks for sharing 🍕',
          authorId: 'user3',
          authorName: 'Food Lover',
          createdAt: '2024-03-10T11:15:00Z'
        }
      ],
      createdAt: { toDate: () => new Date('2024-03-10T09:00:00Z') }
    },
    {
      id: 'dummy2',
      title: '🥗 Rainbow Buddha Bowl',
      description: 'Healthy and colorful Buddha bowl packed with nutrients! Perfect for meal prep and so satisfying. The tahini dressing ties everything together beautifully.',
      recipe: '1. Cook quinoa according to package directions\n2. Roast sweet potato and broccoli at 400°F for 25 minutes\n3. Prepare tahini dressing with lemon and garlic\n4. Arrange all ingredients in a bowl\n5. Drizzle with dressing and sprinkle seeds',
      ingredients: 'quinoa, sweet potato, broccoli, chickpeas, avocado, spinach, tahini, lemon, garlic, pumpkin seeds',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      authorId: 'user2',
      authorName: 'Healthy Hannah',
      authorEmail: 'hannah@example.com',
      likes: ['user1', 'user4'],
      comments: [
        {
          id: 'c3',
          text: 'Love how colorful this is! Definitely making this for lunch tomorrow 🌈',
          authorId: 'user1',
          authorName: 'Chef Marco',
          createdAt: '2024-03-09T14:20:00Z'
        }
      ],
      createdAt: { toDate: () => new Date('2024-03-09T12:00:00Z') }
    },
    {
      id: 'dummy3',
      title: '🍰 Chocolate Lava Cake',
      description: 'Indulgent chocolate lava cake that melts in your mouth! Perfect for date night or when you need a chocolate fix. The molten center is pure heaven!',
      recipe: '1. Butter ramekins and dust with cocoa powder\n2. Melt chocolate and butter in double boiler\n3. Whisk eggs, sugar, and flour\n4. Combine mixtures and pour into ramekins\n5. Bake at 425°F for 12-14 minutes\n6. Invert onto plates and serve immediately',
      ingredients: 'dark chocolate, butter, eggs, sugar, flour, cocoa powder, vanilla',
      imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      authorId: 'user3',
      authorName: 'Sweet Tooth Sam',
      authorEmail: 'sam@example.com',
      likes: ['user1', 'user2', 'user4', 'user5'],
      comments: [
        {
          id: 'c4',
          text: 'OMG this looks incredible! I need this recipe in my life 😍',
          authorId: 'user4',
          authorName: 'Dessert Queen',
          createdAt: '2024-03-08T19:45:00Z'
        },
        {
          id: 'c5',
          text: 'Made this for my anniversary dinner - it was PERFECT! Thank you!',
          authorId: 'user2',
          authorName: 'Healthy Hannah',
          createdAt: '2024-03-08T20:30:00Z'
        }
      ],
      createdAt: { toDate: () => new Date('2024-03-08T18:00:00Z') }
    },
    {
      id: 'dummy4',
      title: '🍜 Authentic Ramen Bowl',
      description: 'Spent all day making this rich, flavorful ramen from scratch! The broth simmered for 12 hours and it was so worth it. Nothing beats homemade ramen!',
      recipe: '1. Simmer pork bones for 12 hours to make tonkotsu broth\n2. Prepare chashu pork by braising in soy sauce and mirin\n3. Cook ramen noodles according to package\n4. Soft boil eggs and marinate in soy sauce mixture\n5. Assemble bowl with noodles, broth, and toppings',
      ingredients: 'pork bones, ramen noodles, eggs, chashu pork, green onions, nori, bamboo shoots, miso paste',
      imageUrl: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      authorId: 'user4',
      authorName: 'Ramen Master',
      authorEmail: 'ramen@example.com',
      likes: ['user1', 'user3'],
      comments: [
        {
          id: 'c6',
          text: 'Wow, 12 hours! That dedication is amazing. It looks restaurant quality! 🍜',
          authorId: 'user1',
          authorName: 'Chef Marco',
          createdAt: '2024-03-07T16:20:00Z'
        }
      ],
      createdAt: { toDate: () => new Date('2024-03-07T15:00:00Z') }
    },
    {
      id: 'dummy5',
      title: '🥖 Fresh Baked Sourdough Bread',
      description: 'My sourdough starter finally paid off! This loaf has the perfect crust and the most amazing tangy flavor. There\'s nothing like the smell of fresh bread baking.',
      recipe: '1. Feed sourdough starter 8-12 hours before baking\n2. Mix starter with flour, water, and salt\n3. Perform stretch and folds every 30 minutes for 2 hours\n4. Bulk ferment for 4-6 hours at room temperature\n5. Shape and cold ferment overnight\n6. Bake in Dutch oven at 475°F for 45 minutes',
      ingredients: 'sourdough starter, bread flour, water, salt',
      imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      authorId: 'user5',
      authorName: 'Bread Baker Betty',
      authorEmail: 'betty@example.com',
      likes: ['user2', 'user4'],
      comments: [],
      createdAt: { toDate: () => new Date('2024-03-06T08:30:00Z') }
    }
  ];

  const [posts, setPosts] = useState(dummyPosts);
  const [loading, setLoading] = useState(false);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    recipe: '',
    imageUrl: '',
    ingredients: '',
  });
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');

  // Fetch all posts from Firestore and combine with dummy posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsQuery = query(
        collection(db, 'communityPosts'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(postsQuery);
      const realPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Combine real posts with dummy posts, real posts first
      const allPosts = [...realPosts, ...dummyPosts];
      setPosts(allPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load community posts');
      // If Firebase fails, just show dummy posts
      setPosts(dummyPosts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create new post
  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.description) {
      toast.error('Please fill in title and description');
      return;
    }

    try {
      const postData = {
        ...newPost,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email,
        authorEmail: currentUser.email,
        likes: [],
        comments: [],
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'communityPosts'), postData);
      toast.success('Post created successfully!');
      setOpenCreatePost(false);
      setNewPost({
        title: '',
        description: '',
        recipe: '',
        imageUrl: '',
        ingredients: '',
      });
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  // Toggle like on post
  const handleLike = async (postId, currentLikes) => {
    try {
      // Check if it's a dummy post
      if (postId.startsWith('dummy')) {
        // Handle dummy post likes locally
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              const userLiked = currentLikes.includes(currentUser.uid);
              const updatedLikes = userLiked 
                ? currentLikes.filter(id => id !== currentUser.uid)
                : [...currentLikes, currentUser.uid];
              return { ...post, likes: updatedLikes };
            }
            return post;
          })
        );
        return;
      }

      // Handle real Firebase posts
      const postRef = doc(db, 'communityPosts', postId);
      const userLiked = currentLikes.includes(currentUser.uid);

      if (userLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid),
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid),
        });
      }

      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error updating like:', error);
      toast.error('Failed to update like');
    }
  };

  // Add comment to post
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const comment = {
        id: Date.now().toString(),
        text: newComment,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email,
        createdAt: new Date().toISOString(),
      };

      // Check if it's a dummy post
      if (selectedPost.id.startsWith('dummy')) {
        // Handle dummy post comments locally
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === selectedPost.id) {
              return { 
                ...post, 
                comments: [...(post.comments || []), comment] 
              };
            }
            return post;
          })
        );
        
        // Update selectedPost for dialog
        setSelectedPost(prev => ({
          ...prev,
          comments: [...(prev.comments || []), comment]
        }));
      } else {
        // Handle real Firebase posts
        const postRef = doc(db, 'communityPosts', selectedPost.id);
        await updateDoc(postRef, {
          comments: arrayUnion(comment),
        });
        fetchPosts(); // Refresh posts
      }

      setNewComment('');
      setCommentDialogOpen(false);
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const openCommentDialog = (post) => {
    setSelectedPost(post);
    setCommentDialogOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>Loading community posts...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: 2 }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              mb: 2
            }}
          >
            🍳 Cooking Community
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Share your culinary creations, discover amazing recipes, and connect with fellow food lovers from around the world!
          </Typography>
        </Box>

        {/* Main Layout Grid */}
        <Grid container spacing={3}>
          {/* Left Sidebar */}
          <Grid item xs={12} md={3}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              {/* Community Stats */}
              <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  📊 Community Stats
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Active Cooks</Typography>
                    <Chip label="2,847" size="small" color="success" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Recipes Shared</Typography>
                    <Chip label="1,234" size="small" color="info" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Total Likes</Typography>
                    <Chip label="15,678" size="small" color="error" />
                  </Box>
                </Box>
              </Paper>

              {/* Trending Ingredients */}
              <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  🔥 Trending Now
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['Avocado', 'Sourdough', 'Matcha', 'Truffle', 'Kimchi', 'Oat Milk'].map((ingredient) => (
                    <Chip 
                      key={ingredient}
                      label={ingredient}
                      size="small"
                      variant="outlined"
                      sx={{ '&:hover': { bgcolor: 'primary.light', color: 'white' } }}
                    />
                  ))}
                </Box>
              </Paper>

              {/* Quick Actions */}
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  ⚡ Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<Add />} 
                    onClick={() => setOpenCreatePost(true)}
                    fullWidth
                  >
                    Share Recipe
                  </Button>
                  <Button variant="outlined" startIcon={<Search />} fullWidth>
                    Discover Recipes
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={6}>
            {/* Posts List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {posts.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    No posts yet! 🥺
                  </Typography>
                  <Typography color="textSecondary">
                    Be the first to share your cooking creation with the community!
                  </Typography>
                </Paper>
              ) : (
                posts.map((post) => (
                  <Card 
                    key={post.id} 
                    elevation={3}
                    sx={{ 
                      borderRadius: 3,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    {/* Post Header */}
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar sx={{ 
                          mr: 2, 
                          bgcolor: 'primary.main',
                          width: 48,
                          height: 48,
                          fontSize: '1.2rem'
                        }}>
                          {post.authorName?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {post.authorName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {post.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                          </Typography>
                        </Box>
                        <Chip 
                          label="Recipe Sharer" 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>

                      <Typography variant="h5" gutterBottom fontWeight="bold" color="text.primary">
                        {post.title}
                      </Typography>
                      <Typography variant="body1" paragraph color="text.secondary">
                        {post.description}
                      </Typography>

                      {/* Recipe and Ingredients */}
                      {post.recipe && (
                        <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                          <Typography variant="h6" color="primary.dark" gutterBottom fontWeight="bold">
                            📝 Recipe Instructions:
                          </Typography>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                            {post.recipe}
                          </Typography>
                        </Paper>
                      )}

                      {post.ingredients && (
                        <Box mb={2}>
                          <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
                            🛒 Ingredients:
                          </Typography>
                          <Box display="flex" flexWrap="wrap" gap={1}>
                            {post.ingredients.split(',').map((ingredient, index) => (
                              <Chip
                                key={index}
                                label={ingredient.trim()}
                                size="small"
                                variant="filled"
                                color="secondary"
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </CardContent>

                    {/* Post Image */}
                    {post.imageUrl && (
                      <CardMedia
                        component="img"
                        height="350"
                        image={post.imageUrl}
                        alt={post.title}
                        sx={{ 
                          objectFit: 'cover',
                          cursor: 'pointer',
                          transition: 'transform 0.3s',
                          '&:hover': {
                            transform: 'scale(1.02)'
                          }
                        }}
                      />
                    )}

                    {/* Post Actions */}
                    <CardActions sx={{ px: 2, pb: 2 }}>
                      <Button
                        startIcon={post.likes?.includes(currentUser.uid) ? <Favorite /> : <FavoriteBorder />}
                        onClick={() => handleLike(post.id, post.likes || [])}
                        color={post.likes?.includes(currentUser.uid) ? 'error' : 'inherit'}
                        size="small"
                      >
                        {post.likes?.length || 0} Likes
                      </Button>

                      <Button
                        startIcon={<Comment />}
                        onClick={() => openCommentDialog(post)}
                        size="small"
                      >
                        {post.comments?.length || 0} Comments
                      </Button>

                      <Button startIcon={<Share />} size="small">
                        Share
                      </Button>
                    </CardActions>

                    {/* Comments Preview */}
                    {post.comments && post.comments.length > 0 && (
                      <CardContent sx={{ pt: 0, bgcolor: 'grey.50' }}>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                          Recent Comments:
                        </Typography>
                        {post.comments.slice(-2).map((comment) => (
                          <Box key={comment.id} display="flex" alignItems="start" mb={1}>
                            <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.8rem' }}>
                              {comment.authorName?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="caption" fontWeight="bold" color="primary">
                                {comment.authorName}
                              </Typography>
                              <Typography variant="body2">
                                {comment.text}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                        {post.comments.length > 2 && (
                          <Button
                            size="small"
                            onClick={() => openCommentDialog(post)}
                            sx={{ mt: 1 }}
                          >
                            View all {post.comments.length} comments
                          </Button>
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </Box>
          </Grid>

          {/* Right Sidebar */}
          <Grid item xs={12} md={3}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              {/* Upcoming Events */}
              <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  📅 Upcoming Events
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ borderLeft: '3px solid #ff6b6b', pl: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Italian Cooking Masterclass
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Nov 15, 2025 • 7:00 PM
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Learn authentic pasta making with Chef Giuseppe
                    </Typography>
                  </Box>
                  
                  <Box sx={{ borderLeft: '3px solid #4ecdc4', pl: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Vegan Dessert Workshop
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Nov 22, 2025 • 3:00 PM
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Create delicious plant-based sweets
                    </Typography>
                  </Box>

                  <Box sx={{ borderLeft: '3px solid #feca57', pl: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Thanksgiving Feast Prep
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Nov 28, 2025 • 2:00 PM
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Plan and prep your holiday menu
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Recipe of the Day */}
              <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  ⭐ Recipe of the Day
                </Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                    alt="Featured Recipe"
                    style={{ 
                      width: '100%', 
                      height: 120, 
                      objectFit: 'cover', 
                      borderRadius: 8,
                      marginBottom: 12
                    }}
                  />
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Classic Beef Burger
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Juicy homemade burger with special sauce
                  </Typography>
                  <Button variant="contained" size="small" fullWidth>
                    Try This Recipe
                  </Button>
                </Box>
              </Paper>

              {/* Top Contributors */}
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  🏆 Top Contributors
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { name: 'Chef Marco', recipes: 23, avatar: 'M' },
                    { name: 'Healthy Hannah', recipes: 18, avatar: 'H' },
                    { name: 'Dessert Queen', recipes: 15, avatar: 'D' },
                  ].map((contributor, index) => (
                    <Box key={contributor.name} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip 
                        label={`#${index + 1}`} 
                        size="small" 
                        color={index === 0 ? 'warning' : index === 1 ? 'info' : 'success'}
                      />
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.9rem' }}>
                        {contributor.avatar}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="body2" fontWeight="bold">
                          {contributor.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {contributor.recipes} recipes shared
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Create Post FAB */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
        onClick={() => setOpenCreatePost(true)}
      >
        <Add />
      </Fab>

      {/* Create Post Dialog */}
      <Dialog
        open={openCreatePost}
        onClose={() => setOpenCreatePost(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5">Share Your Cooking Creation! 👨‍🍳</Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Post Title"
            fullWidth
            variant="outlined"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newPost.description}
            onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Recipe Instructions (Optional)"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newPost.recipe}
            onChange={(e) => setNewPost({ ...newPost, recipe: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Ingredients (comma-separated)"
            fullWidth
            variant="outlined"
            placeholder="flour, eggs, milk, sugar"
            value={newPost.ingredients}
            onChange={(e) => setNewPost({ ...newPost, ingredients: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Image URL (Optional)"
            fullWidth
            variant="outlined"
            placeholder="https://example.com/your-food-image.jpg"
            value={newPost.imageUrl}
            onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreatePost(false)}>Cancel</Button>
          <Button onClick={handleCreatePost} variant="contained" startIcon={<PhotoCamera />}>
            Share Post
          </Button>
        </DialogActions>
      </Dialog>

      {/* Comments Dialog */}
      <Dialog
        open={commentDialogOpen}
        onClose={() => setCommentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Comments</DialogTitle>
        <DialogContent>
          {selectedPost?.comments && selectedPost.comments.length > 0 ? (
            <List>
              {selectedPost.comments.map((comment) => (
                <ListItem key={comment.id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>
                      {comment.authorName?.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={comment.authorName}
                    secondary={comment.text}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No comments yet. Be the first to comment!</Typography>
          )}
          
          <Box display="flex" alignItems="center" mt={2}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <IconButton
              color="primary"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              <Send />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Community;