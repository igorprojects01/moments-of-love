
insert into storage.buckets (id, name, public) values ('galeria', 'galeria', true)
on conflict (id) do update set public = true;

create policy "Galeria public read"
on storage.objects for select
using (bucket_id = 'galeria');

create policy "Galeria public insert"
on storage.objects for insert
with check (bucket_id = 'galeria');
