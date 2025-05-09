'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, PlusCircle, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  id: string;
  created_at: string;
  title: string;
  image_url?: string | null;
  user_id: string;
}

const DashboardPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostImageFile, setNewPostImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Handle image preview
  useEffect(() => {
    if (!newPostImageFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(newPostImageFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [newPostImageFile]);

  // Fetch posts
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
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
        toast.success('Posts loaded successfully');
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        if (err instanceof Error) {
          setError(err.message);
          toast.error(`Error: ${err.message}`);
        } else {
          setError('An unknown error occurred while fetching posts.');
          toast.error('An unknown error occurred');
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
      toast.warning('Title is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const toastId = toast.loading('Creating post...');

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
          .from('cc59')
          .upload(fileName, newPostImageFile);

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('cc59')
          .getPublicUrl(fileName);

        if (!publicUrlData?.publicUrl) {
          throw new Error('Failed to get public URL for uploaded image.');
        }

        imageUrl = publicUrlData.publicUrl;
        setNewPostImageFile(null);
        setPreviewUrl(null);
      } catch (uploadError) {
        console.error('Image upload process failed:', uploadError);
        const errorMessage =
          uploadError instanceof Error
            ? uploadError.message
            : 'An unexpected error occurred during image upload.';
        setError(errorMessage);
        toast.error(`Error: ${errorMessage}`, { id: toastId });
        setIsSubmitting(false);
        return;
      }
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
      setPosts([createdPost, ...posts]);
      setNewPostTitle('');

      toast.success('Post created successfully!', { id: toastId });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || (isLoading && posts.length === 0)) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p className='text-lg'>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user && !authLoading) {
    return (
      <div className='flex flex-col justify-center items-center min-h-screen gap-6 p-4'>
        <div className='text-center max-w-md'>
          <h1 className='text-2xl font-bold mb-2'>Access Denied</h1>
          <p className='text-muted-foreground'>
            You need to be logged in to view this content. Please sign in to
            access your dashboard.
          </p>
        </div>
        <Button asChild>
          <a href='/login' className='px-6 py-3'>
            Go to Login
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4 md:p-8'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='mb-12'
      >
        <h1 className='text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent'>
          Your Dashboard
        </h1>
        <p className='text-center text-muted-foreground max-w-2xl mx-auto'>
          Create and manage your posts in one place
        </p>
      </motion.div>

      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Create Post Card */}
        <div className='w-full lg:w-1/3'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className='border-0 shadow-lg bg-gradient-to-br from-background to-muted/50'>
              <CardHeader>
                <div className='flex items-center gap-3'>
                  <PlusCircle className='h-6 w-6 text-primary' />
                  <CardTitle>Create New Post</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreatePost} className='space-y-4'>
                  <div>
                    <label
                      htmlFor='postTitle'
                      className='block text-sm font-medium mb-2'
                    >
                      Title <span className='text-red-500'>*</span>
                    </label>
                    <Input
                      id='postTitle'
                      type='text'
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder="What's on your mind?"
                      required
                      className='w-full focus-visible:ring-primary'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='postImageFile'
                      className='block text-sm font-medium mb-2'
                    >
                      Image (Optional)
                    </label>
                    <div className='flex flex-col gap-4'>
                      <label className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors'>
                        <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                          <ImageIcon className='w-8 h-8 mb-3 text-muted-foreground' />
                          <p className='text-sm text-muted-foreground'>
                            {newPostImageFile
                              ? 'Change image'
                              : 'Click to upload'}
                          </p>
                        </div>
                        <Input
                          id='postImageFile'
                          type='file'
                          accept='image/*'
                          onChange={(e) =>
                            setNewPostImageFile(
                              e.target.files ? e.target.files[0] : null
                            )
                          }
                          className='hidden'
                        />
                      </label>

                      {previewUrl && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className='relative w-full h-48 rounded-md overflow-hidden border'
                        >
                          <Image
                            src={previewUrl}
                            alt='Preview'
                            fill
                            className='object-cover'
                          />
                          <button
                            type='button'
                            onClick={() => {
                              setNewPostImageFile(null);
                              setPreviewUrl(null);
                            }}
                            className='absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors'
                          >
                            <X className='h-4 w-4' />
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full mt-6'
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Creating...
                      </>
                    ) : (
                      'Create Post'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Posts Column */}
        <div className='w-full lg:w-2/3'>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-semibold'>
                Your Posts{' '}
                <span className='text-muted-foreground'>({posts.length})</span>
              </h2>
            </div>

            {isLoading && posts.length === 0 && (
              <div className='flex justify-center items-center h-64'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
              </div>
            )}

            {!isLoading && posts.length === 0 && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/50'
              >
                <ImageIcon className='h-12 w-12 text-muted-foreground mb-4' />
                <h3 className='text-lg font-medium mb-2'>No posts yet</h3>
                <p className='text-muted-foreground text-center max-w-md'>
                  You haven`t created any posts yet. Use the form to share your
                  first post!
                </p>
              </motion.div>
            )}

            {error && posts.length === 0 && (
              <div className='p-4 rounded-lg bg-red-50 border border-red-200 text-red-600'>
                <p>Error fetching posts: {error}</p>
              </div>
            )}

            <AnimatePresence>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {posts.map((post) => (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className='h-full flex flex-col hover:shadow-lg transition-shadow'>
                      {post.image_url && (
                        <div className='relative h-48 w-full'>
                          <Image
                            src={post.image_url}
                            alt={post.title}
                            fill
                            className='object-cover rounded-t-lg'
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className='line-clamp-2'>
                          {post.title}
                        </CardTitle>
                        <>
                          Posted on{' '}
                          {new Date(post.created_at).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </>
                      </CardHeader>
                      <CardContent className='mt-auto'>
                        <Button variant='outline' size='sm' className='w-full'>
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
