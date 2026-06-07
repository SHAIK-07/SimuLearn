-- Add content_markdown and code_content columns to lessons table
alter table public.lessons add column if not exists content_markdown text;
alter table public.lessons add column if not exists code_content text;

-- Add unique constraint to quizzes(lesson_slug) for upserting
alter table public.quizzes add constraint quizzes_lesson_slug_key unique (lesson_slug);
