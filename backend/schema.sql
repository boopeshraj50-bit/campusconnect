create table if not exists public.events (
    id uuid primary key default gen_random_uuid(),
    organizer_id text not null,
    capacity integer not null check (capacity >= 0),
    registered_count integer not null default 0 check (registered_count >= 0),
    data jsonb not null
);

create table if not exists public.registrations (
    id text primary key,
    event_id uuid not null references public.events(id) on delete cascade,
    student_id text not null,
    email text not null,
    registered_at timestamptz not null default now(),
    checked_in boolean not null default false,
    checked_in_at timestamptz,
    data jsonb not null
);

alter table public.events
    add column if not exists organizer_id text,
    add column if not exists capacity integer not null default 0,
    add column if not exists registered_count integer not null default 0,
    add column if not exists data jsonb not null default '{}'::jsonb;

alter table public.registrations
    add column if not exists id text default (
        gen_random_uuid()::text
    ),
    add column if not exists event_id uuid references public.events(id) on delete cascade,
    add column if not exists student_id text not null default '',
    add column if not exists email text not null default '',
    add column if not exists registered_at timestamptz not null default now(),
    add column if not exists checked_in boolean not null default false,
    add column if not exists checked_in_at timestamptz,
    add column if not exists data jsonb not null default '{}'::jsonb;

create unique index if not exists registrations_event_student_id_unique
    on public.registrations (event_id, lower(student_id))
    where event_id is not null and student_id <> '';

create unique index if not exists registrations_event_email_unique
    on public.registrations (event_id, lower(email))
    where event_id is not null and email <> '';

update public.registrations
set data = jsonb_build_object(
    'id', id,
    'eventId', event_id,
    'fullName', coalesce(data->>'fullName', ''),
    'email', email,
    'studentId', student_id,
    'registeredAt', registered_at,
    'checkedIn', checked_in,
    'checkedInAt', checked_in_at,
    'status', coalesce(data->>'status', 'Confirmed'),
    'ticketCode', coalesce(data->>'ticketCode', ''),
    'department', coalesce(data->>'department', ''),
    'year', coalesce(data->>'year', '')
)
where data = '{}'::jsonb;

alter table public.events disable row level security;
alter table public.registrations disable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.events to anon, authenticated;
grant update on public.events to anon, authenticated;
grant select, insert, update on public.registrations to anon, authenticated;

drop function if exists public.create_registration(text, jsonb);

create or replace function public.create_registration(
    p_event_id uuid,
    p_registration jsonb
)
returns jsonb
language plpgsql
as $$
declare
    v_event public.events%rowtype;
    v_registration jsonb;
    v_registration_id text;
    v_ticket_code text;
    v_count integer;
begin
    select *
    into v_event
    from public.events
    where id = p_event_id
    for update;

    if not found then
        return jsonb_build_object(
            'status', 404,
            'data', jsonb_build_object(
                'error', 'Not found',
                'message', 'Event not found'
            )
        );
    end if;

    if exists (
        select 1
        from public.registrations
        where event_id = p_event_id
          and (
              lower(student_id) = lower(p_registration->>'studentId')
              or lower(email) = lower(p_registration->>'email')
          )
    ) then
        return jsonb_build_object(
            'status', 409,
            'data', jsonb_build_object(
                'error', 'Conflict',
                'code', 'ALREADY_REGISTERED',
                'message', 'This student is already registered for the event.',
                'eventId', p_event_id
            )
        );
    end if;

    v_count := v_event.registered_count;
    if v_count >= v_event.capacity then
        return jsonb_build_object(
            'status', 409,
            'data', jsonb_build_object(
                'error', 'Conflict',
                'code', 'CAPACITY_REACHED',
                'message', 'This event is completely booked out.',
                'capacity', v_event.capacity
            )
        );
    end if;

    v_registration_id := gen_random_uuid()::text;
    v_ticket_code := 'CC-'
        || upper(regexp_replace(p_event_id::text, '^evt-', '', 'i'))
        || '-'
        || right(upper(regexp_replace(p_registration->>'studentId', '[^a-zA-Z0-9]', '', 'g')), 4);

    v_registration := p_registration || jsonb_build_object(
        'id', v_registration_id,
        'eventId', p_event_id,
        'eventTitle', v_event.data->'title',
        'eventDate', v_event.data->'date',
        'eventVenue', v_event.data->'venue',
        'category', v_event.data->'category',
        'coverImage', v_event.data->'coverImage',
        'department', coalesce(p_registration->>'department', 'General Studies'),
        'year', coalesce(p_registration->>'year', '1st Year'),
        'specialNotes', coalesce(p_registration->>'specialNotes', ''),
        'registeredAt', now()::text,
        'status', 'Confirmed',
        'ticketCode', v_ticket_code,
        'seatNumber', 'Seat ' || (v_count + 1),
        'qrData', 'CAMPUSCONNECT:PASS:' || p_event_id::text || ':' || v_registration_id
            || ':' || (p_registration->>'studentId'),
        'checkedIn', false
    );

    insert into public.registrations (
        id,
        event_id,
        student_id,
        email,
        data
    )
    values (
        v_registration_id,
        p_event_id,
        p_registration->>'studentId',
        p_registration->>'email',
        v_registration
    );

    update public.events
    set registered_count = v_count + 1,
        data = jsonb_set(data, '{registeredCount}', to_jsonb(v_count + 1), true)
    where id = p_event_id;

    return jsonb_build_object(
        'status', 201,
        'data', jsonb_build_object(
            'success', true,
            'registration', v_registration,
            'message', 'Registration confirmed successfully!'
        )
    );
end;
$$;

grant execute on function public.create_registration(uuid, jsonb) to anon, authenticated, service_role;
