create table surveys (
    id serial primary key,
    name text not null,
    time integer not null
);

create table questions (
    id serial primary key,
    question text not null,
    survey_id integer references surveys(id) not null 
);

create table options (
    id serial primary key,
    value text not null,
    question_id integer references questions(id) not null
);

create table responses (
    id serial primary key,
    question_id integer references questions(id) not null,
    value text not null
);
