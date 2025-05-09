'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion'; // Import motion
import Image from 'next/image'; // Import Next Image

// Define the Post type (can be imported from a shared types file if available)
interface Post {
  id: string;
  created_at: string;
  title: string;
  image_url?: string | null;
  user_id: string; // Or a user object if you join user data
}

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/posts?limit=6'); // Fetch latest 6 posts for homepage
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch posts');
        }
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts for homepage:', err);
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
  }, []);

  if (isLoading) {
    return (
      <div className='text-center py-10'>
        <p>Loading latest posts...</p>
        {/* Optional: Add a simple spinner component here */}
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-10 text-red-500'>
        <p>Could not load posts: {error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className='text-center py-10'>
        <p>No posts available yet.</p>
      </div>
    );
  }

  return (
    <section id='latest-posts' className='py-12 bg-slate-50'>
      {/* <motion.div
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className='text-center mb-10 md:mb-16'
        >
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Latest From Our Community
          </h2>
          <p className='mt-4 text-lg text-muted-foreground sm:text-xl'>
            See what others are sharing and get inspired.
          </p>
        </motion.div> */}

      <motion.div
        variants={container}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, amount: 0.1 }}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'
      >
        {posts.map((post) => (
          <motion.div key={post.id} variants={item}>
            <Card className='shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col'>
              {post.image_url && (
                <div className='aspect-video w-full overflow-hidden rounded-t-lg'>
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    className='object-cover transition-transform duration-300 hover:scale-105'
                    onError={(
                      e: React.SyntheticEvent<HTMLImageElement, Event>
                    ) => {
                      // Type assertion for currentTarget if needed, or handle more gracefully
                      (e.currentTarget as HTMLImageElement).style.display =
                        'none';
                    }}
                  />
                </div>
              )}
              <CardHeader className={`${!post.image_url ? 'pt-6' : ''}`}>
                <CardTitle className='truncate text-xl font-semibold leading-tight'>
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='flex-grow'>
                <p className='text-sm text-gray-500 mt-1'>
                  Published on: {new Date(post.created_at).toLocaleDateString()}
                </p>
              </CardContent>
              {/* Optional: Add a link to the full post if you have individual post pages */}
              {/* <CardFooter>
                  <Link href={`/posts/${post.id}`} className="text-blue-600 hover:underline">
                    Read more
                  </Link>
                </CardFooter> */}
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

// Minimal container and item variants for motion (can be imported if shared)
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default PostList;
