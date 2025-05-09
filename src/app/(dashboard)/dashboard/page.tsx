'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext'; // To ensure user is loaded
import { createSupabaseBrowserClient } from '@/lib/supabase/client'; // Supabase client
import Image from 'next/image';

// Define the Post type based on your Supabase table
interface Post {
  id: string;
  created_at: string;
  title: string;
  image_url?: string | null;
  user_id: string;
}

const DashboardPage = () => {
  const { user, isLoading: authLoading } = useAuth(); // Get user from AuthContext
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostImageFile, setNewPostImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch posts
  useEffect(() => {
    if (authLoading) return; // Wait for auth state to load
    if (!user) {
      // User not logged in, or session still loading
      // Redirect or show message, handled by middleware or AuthContext typically
      setIsLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch posts');
        }
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred while fetching posts.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [user, authLoading]);

  // Handle create post
  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) {
      alert('Title is required.');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    let imageUrl: string | null = null;
    const supabase = createSupabaseBrowserClient();

    if (newPostImageFile && user) {
      try {
        const fileName = `public/${
          user.id
        }/${Date.now()}_${newPostImageFile.name.replace(
          /[^a-zA-Z0-9_.-]/g,
          '_'
        )}`;
        const { error: uploadError } = await supabase.storage
          .from('cc59') // Your bucket name
          .upload(fileName, newPostImageFile);

        if (uploadError) {
          console.error('Supabase upload error:', uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('cc59') // Your bucket name
          .getPublicUrl(fileName);

        if (!publicUrlData || !publicUrlData.publicUrl) {
          console.error('Failed to get public URL for:', fileName);
          throw new Error('Failed to get public URL for uploaded image.');
        }
        imageUrl = publicUrlData.publicUrl;
        setNewPostImageFile(null);
      } catch (uploadError) {
        console.error('Image upload process failed:', uploadError);
        if (uploadError instanceof Error) {
          setError(uploadError.message);
        } else {
          setError('An unexpected error occurred during image upload.');
        }
        setIsSubmitting(false);
        return;
      }
    } else if (newPostImageFile && !user) {
      setError(
        'User not available for image upload. Please ensure you are logged in.'
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newPostTitle, image_url: imageUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      const createdPost: Post = await response.json();
      setPosts([createdPost, ...posts]); // Add new post to the beginning of the list
      setNewPostTitle('');
      setNewPostImageFile(null); // Reset file input
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        alert(`Error creating post: ${err.message}`);
      } else {
        setError('An unexpected error occurred during image upload.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || (isLoading && posts.length === 0)) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user && !authLoading) {
    return (
      <div className='flex flex-col justify-center items-center min-h-screen'>
        <p className='mb-4'>You need to be logged in to view this page.</p>
        <Button asChild>
          <a href='/login'>Go to Login</a>
        </Button>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4 md:p-8'>
      <h1 className='text-3xl font-bold mb-8 text-center'>Your Dashboard</h1>

      <div className='flex flex-col md:flex-row md:space-x-8'>
        {/* Left Column: Create Post Form */}
        <div className='md:w-1/3'>
          <Card className='mb-8 shadow-lg'>
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePost} className='space-y-4'>
                <div>
                  <label
                    htmlFor='postTitle'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Title <span className='text-red-500'>*</span>
                  </label>
                  <Input
                    id='postTitle'
                    type='text'
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder='Enter post title'
                    required
                    className='w-full'
                  />
                </div>
                <div>
                  <label
                    htmlFor='postImageFile'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Image (Optional)
                  </label>
                  <Input
                    id='postImageFile'
                    type='file'
                    accept='image/*'
                    onChange={(e) =>
                      setNewPostImageFile(
                        e.target.files ? e.target.files[0] : null
                      )
                    }
                    className='w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90'
                  />
                </div>
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full sm:w-auto'
                >
                  {isSubmitting ? 'Creating Post...' : 'Create Post'}
                </Button>
                {error && (
                  <p className='text-red-500 text-sm mt-2'>{`Error: ${error}`}</p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Display Posts */}
        <div className='md:w-2/3'>
          <h2 className='text-2xl font-semibold mb-6 text-center md:text-left'>
            Your Posts
          </h2>
          {isLoading && posts.length === 0 && (
            <p className='text-center'>Loading posts...</p>
          )}
          {!isLoading && posts.length === 0 && !error && (
            <p className='text-center text-gray-500'>
              You havent created any posts yet. Use the form on the left to
              create one!
            </p>
          )}

          {error && posts.length === 0 && (
            <p className='text-red-500 text-center'>{`Error fetching posts: ${error}`}</p>
          )}

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6'>
            {posts.map((post) => (
              <Card
                key={post.id}
                className='shadow-md hover:shadow-xl transition-shadow duration-300'
              >
                <CardHeader>
                  <CardTitle className='truncate'>{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {post.image_url && (
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      height={400}
                      width={400}
                      className='w-full h-48 object-cover rounded-md mb-4'
                      onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails to load
                    />
                  )}
                  <p className='text-sm text-gray-500'>
                    Created on: {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
                {/* Add CardFooter for actions like Edit/Delete later if needed */}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
