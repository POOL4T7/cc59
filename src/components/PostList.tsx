'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Post {
  id: string;
  created_at: string;
  title: string;
  image_url?: string | null;
  user_id: string;
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
        const response = await fetch('/api/public-post?limit=4');
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
                <div className='aspect-video w-full overflow-hidden rounded-t-lg relative'>
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    className='object-cover'
                    onError={(
                      e: React.SyntheticEvent<HTMLImageElement, Event>
                    ) => {
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
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

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
