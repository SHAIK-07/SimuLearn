-- Create courses table
create table public.courses (
  slug text primary key,
  title text not null,
  description text not null,
  difficulty text check (difficulty in ('Beginner', 'Intermediate', 'Advanced')) not null,
  estimated_hours int not null,
  icon_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create topics table
create table public.topics (
  slug text primary key,
  course_slug text references public.courses(slug) on delete cascade not null,
  title text not null,
  description text,
  order_index int not null,
  unique(course_slug, order_index)
);

-- Create lessons table
create table public.lessons (
  slug text primary key,
  topic_slug text references public.topics(slug) on delete cascade not null,
  title text not null,
  content_path text not null,
  difficulty_level text check (difficulty_level in ('Simple', 'Medium', 'Hard')) not null,
  order_index int not null,
  unique(topic_slug, order_index)
);

-- Create quizzes table
create table public.quizzes (
  id bigint generated always as identity primary key,
  lesson_slug text references public.lessons(slug) on delete cascade not null,
  questions jsonb not null,
  passing_score int not null default 70
);

-- Create quiz_submissions table
create table public.quiz_submissions (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  quiz_id bigint references public.quizzes(id) on delete cascade not null,
  score int not null,
  passed boolean not null,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add constraints to user_progress to reference courses and topics
alter table public.user_progress
  add constraint fk_user_progress_courses foreign key (course_slug) references public.courses(slug) on delete cascade,
  add constraint fk_user_progress_topics foreign key (topic_slug) references public.topics(slug) on delete cascade;

-- Enable Row Level Security (RLS) on new tables
alter table public.courses enable row level security;
alter table public.topics enable row level security;
alter table public.lessons enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_submissions enable row level security;

-- Courses policies
create policy "Allow public select on courses" on public.courses
  for select to authenticated, anon using (true);

-- Topics policies
create policy "Allow public select on topics" on public.topics
  for select to authenticated, anon using (true);

-- Lessons policies
create policy "Allow public select on lessons" on public.lessons
  for select to authenticated, anon using (true);

-- Quizzes policies
create policy "Allow authenticated select on quizzes" on public.quizzes
  for select to authenticated using (true);

-- Quiz Submissions policies
create policy "Allow users to view own submissions" on public.quiz_submissions
  for select to authenticated using (auth.uid() = user_id);

create policy "Allow users to insert own submissions" on public.quiz_submissions
  for insert to authenticated with check (auth.uid() = user_id);
