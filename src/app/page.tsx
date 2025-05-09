'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Users,
  BarChart3,
  Calendar,
  Clock,
  FileText,
  Shield,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Animation variants
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

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } },
};

const AnimatedFeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial='hidden'
      animate={inView ? 'show' : 'hidden'}
      variants={item}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className='flex flex-col items-center rounded-lg border bg-background p-5 sm:p-6 text-center shadow-sm hover:shadow-md transition-shadow'
    >
      <div className='rounded-full bg-gradient-to-br from-blue-100 to-purple-100 p-2 sm:p-3 text-blue-600'>
        {icon}
      </div>
      <h3 className='mt-3 text-lg font-bold sm:text-xl'>{title}</h3>
      <p className='mt-2 text-sm text-muted-foreground sm:text-base'>
        {description}
      </p>
    </motion.div>
  );
};

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className='flex min-h-screen flex-col'>
      {/* Header with scroll effect */}
      <header
        className={`sticky top-0 z-50 border-b bg-background transition-all duration-300 ${
          scrolled ? 'py-2 shadow-sm' : 'py-0'
        }`}
      >
        <div className='container mx-auto flex h-16 items-center justify-between px-4 sm:px-6'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className='flex items-center gap-2'
          >
            <Users className='h-6 w-6 text-blue-600' />
            <span className='text-lg font-bold sm:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              EmpowerHR
            </span>
          </motion.div>

          <nav className='hidden md:flex items-center gap-6'>
            {['Features', 'Testimonials', 'Pricing', 'FAQ'].map((link, i) => (
              <motion.div
                key={link}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.3 }}
              >
                <Link
                  href={`#${link.toLowerCase()}`}
                  className='text-sm font-medium hover:text-blue-600 transition-colors relative group'
                >
                  {link}
                  <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full'></span>
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className='flex items-center gap-2 sm:gap-4'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className='hidden md:block'
            >
              <Link
                href='/login'
                className='text-sm font-medium hover:text-blue-600 transition-colors'
              >
                Log in
              </Link>
            </motion.div>

            <Button
              variant='ghost'
              size='sm'
              className='md:hidden'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className='h-5 w-5' />
              ) : (
                <Menu className='h-5 w-5' />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className='container md:hidden bg-background border-t overflow-hidden'
          >
            <div className='py-4 px-4 sm:px-6'>
              <nav className='flex flex-col space-y-4'>
                {['Features', 'Testimonials', 'Pricing', 'FAQ'].map((link) => (
                  <Link
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    className='text-sm font-medium hover:text-blue-600 transition-colors'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link}
                  </Link>
                ))}
                <div className='flex flex-col space-y-2 pt-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full'
                    asChild
                  >
                    <Link href='/login'>Log in</Link>
                  </Button>
                  <Button
                    size='sm'
                    className='w-full bg-gradient-to-r from-blue-600 to-purple-600'
                    asChild
                  >
                    <Link href='/signup'>Sign up</Link>
                  </Button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </header>

      <main className='flex-1'>
        {/* Hero Section with gradient background */}
        <section className='relative overflow-hidden py-12 md:py-20 lg:py-24 bg-gradient-to-br from-blue-50 to-purple-50'>
          <div className='container mx-auto flex flex-col items-center text-center px-4 sm:px-6'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='max-w-4xl'
            >
              <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl'>
                Simplify{' '}
                <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  Employee Management
                </span>
              </h1>
              <p className='mt-4 max-w-3xl text-base text-muted-foreground sm:text-lg md:text-xl'>
                A comprehensive solution to streamline HR processes, boost
                productivity, and enhance employee engagement.
              </p>
              <div className='mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center'>
                <Button
                  size='lg'
                  className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg'
                  asChild
                >
                  <Link href='/signup'>
                    Get Started <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                  asChild
                >
                  <Link href='/demo'>Request Demo</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className='mt-12 w-full max-w-5xl rounded-xl border bg-white/80 shadow-xl overflow-hidden'
            >
              <div className='relative pt-6 px-6'>
                <div className='flex gap-2 absolute top-4 left-6'>
                  <div className='h-3 w-3 rounded-full bg-red-500'></div>
                  <div className='h-3 w-3 rounded-full bg-yellow-500'></div>
                  <div className='h-3 w-3 rounded-full bg-green-500'></div>
                </div>
              </div>
              <img
                src='/placeholder.svg?height=600&width=1200'
                alt='EmpowerHR Dashboard Preview'
                className='w-full rounded-b-xl'
                width={1200}
                height={600}
              />
            </motion.div>
          </div>

          {/* Floating animated elements */}
          <div className='absolute top-20 left-10 w-16 h-16 rounded-full bg-purple-100 opacity-30 blur-xl animate-float'></div>
          <div className='absolute bottom-20 right-10 w-24 h-24 rounded-full bg-blue-100 opacity-30 blur-xl animate-float-delay'></div>
        </section>

        {/* Features Section */}
        <section id='features' className='py-16 md:py-20 bg-white'>
          <div className='container mx-auto px-4 sm:px-6'>
            <motion.div
              initial='hidden'
              whileInView='show'
              variants={fadeIn}
              viewport={{ once: true }}
              className='text-center mx-auto max-w-3xl'
            >
              <h2 className='text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl'>
                Powerful{' '}
                <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  Features
                </span>
              </h2>
              <p className='mt-3 text-base text-muted-foreground sm:text-lg'>
                Everything you need to manage your workforce efficiently
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial='hidden'
              whileInView='show'
              viewport={{ once: true }}
              className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
            >
              {[
                {
                  icon: <Users className='h-8 w-8 sm:h-10 sm:w-10' />,
                  title: 'Employee Directory',
                  description:
                    'Centralized database for all employee information with customizable profiles and search capabilities.',
                },
                {
                  icon: <Calendar className='h-8 w-8 sm:h-10 sm:w-10' />,
                  title: 'Leave Management',
                  description:
                    'Streamlined process for requesting, approving, and tracking employee time off and absences.',
                },
                {
                  icon: <Clock className='h-8 w-8 sm:h-10 sm:w-10' />,
                  title: 'Time Tracking',
                  description:
                    'Accurate tracking of work hours, shifts, and overtime with automated reporting.',
                },
                {
                  icon: <FileText className='h-8 w-8 sm:h-10 sm:w-10' />,
                  title: 'Performance Reviews',
                  description:
                    'Structured evaluation processes with customizable templates and scheduling.',
                },
                {
                  icon: <BarChart3 className='h-8 w-8 sm:h-10 sm:w-10' />,
                  title: 'Analytics Dashboard',
                  description:
                    'Comprehensive reports and insights on workforce metrics and trends.',
                },
                {
                  icon: <Shield className='h-8 w-8 sm:h-10 sm:w-10' />,
                  title: 'Compliance Management',
                  description:
                    'Tools to ensure adherence to labor laws and company policies with automated alerts.',
                },
              ].map((feature, index) => (
                <AnimatedFeatureCard key={index} {...feature} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id='testimonials'
          className='py-16 md:py-20 bg-gradient-to-br from-blue-50 to-purple-50'
        >
          <div className='container mx-auto px-4 sm:px-6'>
            <motion.div
              initial='hidden'
              whileInView='show'
              variants={fadeIn}
              viewport={{ once: true }}
              className='text-center mx-auto max-w-3xl'
            >
              <h2 className='text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl'>
                Trusted by{' '}
                <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  HR Leaders
                </span>
              </h2>
              <p className='mt-3 text-base text-muted-foreground sm:text-lg'>
                See what our customers have to say about EmpowerHR
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial='hidden'
              whileInView='show'
              viewport={{ once: true }}
              className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
            >
              {[
                {
                  quote:
                    'EmpowerHR has transformed how we manage our team. The time saved on administrative tasks alone has been worth the investment.',
                  author: 'Sarah Johnson',
                  role: 'HR Director, TechCorp Inc.',
                  color: 'bg-blue-100',
                },
                {
                  quote:
                    'The analytics dashboard gives us insights we never had before. We can now make data-driven decisions about our workforce.',
                  author: 'Michael Chen',
                  role: 'COO, Innovate Solutions',
                  color: 'bg-purple-100',
                },
                {
                  quote:
                    'Implementation was smooth and the support team has been exceptional. Our employees love the self-service features.',
                  author: 'Jessica Rodriguez',
                  role: 'People Operations Manager, GrowthStart',
                  color: 'bg-indigo-100',
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  whileHover={{ y: -5 }}
                  className={`flex flex-col rounded-xl ${testimonial.color} p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className='flex-1'>
                    <p className='italic text-sm text-muted-foreground sm:text-base'>
                      &quot;{testimonial.quote}&quot;
                    </p>
                  </div>
                  <div className='mt-5 flex items-center gap-3 sm:gap-4'>
                    <div
                      className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full ${testimonial.color.replace(
                        '100',
                        '200'
                      )} flex items-center justify-center text-blue-600`}
                    >
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <p className='font-medium'>{testimonial.author}</p>
                      <p className='text-xs text-muted-foreground sm:text-sm'>
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id='pricing' className='py-16 md:py-20 bg-white'>
          <div className='container mx-auto px-4 sm:px-6'>
            <motion.div
              initial='hidden'
              whileInView='show'
              variants={fadeIn}
              viewport={{ once: true }}
              className='text-center mx-auto max-w-3xl'
            >
              <h2 className='text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl'>
                Simple,{' '}
                <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  Transparent
                </span>{' '}
                Pricing
              </h2>
              <p className='mt-3 text-base text-muted-foreground sm:text-lg'>
                Choose the plan that works best for your business
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial='hidden'
              whileInView='show'
              viewport={{ once: true }}
              className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
            >
              {[
                {
                  name: 'Starter',
                  price: '$9',
                  description: 'Perfect for small teams just getting started',
                  features: [
                    'Up to 25 employees',
                    'Employee directory',
                    'Basic time tracking',
                    'Leave management',
                    'Email support',
                  ],
                  popular: false,
                  color: 'from-blue-100 to-blue-50',
                },
                {
                  name: 'Professional',
                  price: '$29',
                  description: 'Ideal for growing businesses with more needs',
                  features: [
                    'Up to 100 employees',
                    'All Starter features',
                    'Performance reviews',
                    'Advanced reporting',
                    'API access',
                    'Priority support',
                  ],
                  popular: true,
                  color: 'from-purple-100 to-purple-50',
                },
                {
                  name: 'Enterprise',
                  price: 'Custom',
                  description:
                    'For large organizations with complex requirements',
                  features: [
                    'Unlimited employees',
                    'All Professional features',
                    'Custom integrations',
                    'Compliance management',
                    'Dedicated account manager',
                    'SLA guarantees',
                  ],
                  popular: false,
                  color: 'from-indigo-100 to-indigo-50',
                },
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  whileHover={{ scale: 1.02 }}
                  className={`flex flex-col rounded-xl border ${
                    plan.popular ? 'border-purple-300 shadow-lg' : ''
                  } bg-gradient-to-b ${plan.color} p-5 sm:p-6`}
                >
                  {plan.popular && (
                    <div className='mb-3 rounded-full bg-purple-600/10 px-3 py-1 text-xs font-medium text-purple-600 w-fit'>
                      Most Popular
                    </div>
                  )}
                  <h3 className='text-xl font-bold sm:text-2xl'>{plan.name}</h3>
                  <div className='mt-3 flex items-baseline'>
                    <span className='text-3xl font-bold sm:text-4xl'>
                      {plan.price}
                    </span>
                    {plan.price !== 'Custom' && (
                      <span className='ml-1 text-sm text-muted-foreground'>
                        /month per employee
                      </span>
                    )}
                  </div>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    {plan.description}
                  </p>
                  <ul className='mt-4 space-y-2 sm:mt-6 sm:space-y-3'>
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className='flex items-start'>
                        <CheckCircle2 className='mr-2 h-4 w-4 mt-0.5 text-blue-600' />
                        <span className='text-sm'>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`mt-6 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href='/signup'>
                      {plan.price === 'Custom'
                        ? 'Contact Sales'
                        : 'Get Started'}
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id='faq'
          className='py-16 md:py-20 bg-gradient-to-br from-blue-50 to-purple-50'
        >
          <div className='container mx-auto px-4 sm:px-6'>
            <motion.div
              initial='hidden'
              whileInView='show'
              variants={fadeIn}
              viewport={{ once: true }}
              className='text-center mx-auto max-w-3xl'
            >
              <h2 className='text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl'>
                Frequently Asked{' '}
                <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  Questions
                </span>
              </h2>
              <p className='mt-3 text-base text-muted-foreground sm:text-lg'>
                Find answers to common questions about EmpowerHR
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial='hidden'
              whileInView='show'
              viewport={{ once: true }}
              className='mt-12 grid gap-4 sm:gap-6 md:grid-cols-2'
            >
              {[
                {
                  question: 'How long does implementation take?',
                  answer:
                    'Most customers are up and running within 2-4 weeks, depending on the size of your organization and complexity of your requirements.',
                },
                {
                  question: 'Can I import data from our existing systems?',
                  answer:
                    'Yes, we provide tools to import employee data from CSV files, Excel, and direct integrations with popular HRIS systems.',
                },
                {
                  question:
                    'Is EmpowerHR compliant with data protection regulations?',
                  answer:
                    'Yes, we are GDPR, CCPA, and SOC 2 compliant. We take data security and privacy very seriously.',
                },
                {
                  question: 'Do you offer mobile apps?',
                  answer:
                    'Yes, we have native apps for iOS and Android that allow employees to access their profiles, request time off, and more.',
                },
                {
                  question: 'Can EmpowerHR integrate with our payroll system?',
                  answer:
                    'Yes, we offer integrations with most popular payroll providers, including ADP, Gusto, and QuickBooks.',
                },
                {
                  question: 'What kind of support do you offer?',
                  answer:
                    'All plans include email support. Professional and Enterprise plans include priority support with faster response times and access to phone support.',
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className='rounded-xl border bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow'
                >
                  <h3 className='text-base font-medium sm:text-lg'>
                    {faq.question}
                  </h3>
                  <p className='mt-2 text-sm text-muted-foreground sm:text-base'>
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='py-16 md:py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
          <div className='container mx-auto text-center px-4 sm:px-6'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className='text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl'>
                Ready to transform your HR operations?
              </h2>
              <p className='mt-3 text-base opacity-90 sm:text-lg max-w-3xl mx-auto'>
                Join thousands of companies already using EmpowerHR to
                streamline their employee management.
              </p>
              <div className='mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center'>
                <Button
                  size='lg'
                  variant='secondary'
                  className='bg-white text-blue-600 hover:bg-gray-100 shadow-lg'
                  asChild
                >
                  <Link href='/signup'>Get Started Today</Link>
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  className='bg-transparent text-white border-white hover:bg-white/10 hover:text-white'
                  asChild
                >
                  <Link href='/demo'>Schedule a Demo</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='border-t bg-white py-10 md:py-12'>
        <div className='container mx-auto grid gap-8 sm:grid-cols-2 md:grid-cols-4 px-4 sm:px-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className='flex items-center gap-2'>
              <Users className='h-6 w-6 text-blue-600' />
              <span className='text-lg font-bold sm:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                EmpowerHR
              </span>
            </div>
            <p className='mt-3 text-sm text-muted-foreground'>
              Simplifying employee management for businesses of all sizes since
              2018.
            </p>
          </motion.div>

          {[
            {
              title: 'Product',
              links: ['Features', 'Pricing', 'Integrations', 'Roadmap'],
            },
            {
              title: 'Resources',
              links: ['Blog', 'Documentation', 'Guides', 'Support Center'],
            },
            {
              title: 'Company',
              links: ['About Us', 'Careers', 'Contact', 'Privacy Policy'],
            },
          ].map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * (i + 1) }}
            >
              <h3 className='text-sm font-medium'>{section.title}</h3>
              <ul className='mt-3 space-y-2'>
                {section.links.map((link) => (
                  <li key={link}>
                    <Link
                      href={`/${link.toLowerCase().replace(' ', '-')}`}
                      className='text-sm text-muted-foreground hover:text-blue-600 transition-colors'
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className='container mx-auto mt-10 border-t pt-6 px-4 sm:px-6'
        >
          <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
            <p className='text-xs text-muted-foreground sm:text-sm'>
              © {new Date().getFullYear()} EmpowerHR. All rights reserved.
            </p>
            <div className='flex gap-4'>
              {['twitter', 'linkedin', 'facebook'].map((social) => (
                <motion.div
                  key={social}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href='#'
                    className='text-muted-foreground hover:text-blue-600 transition-colors'
                  >
                    <span className='sr-only'>{social}</span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='h-4 w-4 sm:h-5 sm:w-5'
                    >
                      {social === 'twitter' && (
                        <path d='M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z'></path>
                      )}
                      {social === 'linkedin' && (
                        <>
                          <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'></path>
                          <rect width='4' height='12' x='2' y='9'></rect>
                          <circle cx='4' cy='4' r='2'></circle>
                        </>
                      )}
                      {social === 'facebook' && (
                        <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'></path>
                      )}
                    </svg>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
