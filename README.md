# todo-nextjs

TODO web app of Next.js

## Environments

- React 18
- Next.js App Router 14
- Tailwind CSS
- Firebase Firestore
- Firebase Authentication

## Features

### User Authentication

```mermaid
sequenceDiagram
    participant u as User
    participant c as Client
    participant s as Server
    participant auth as Firebase<br>Auth

    u ->> c: access
    c ->>+ s: access
    s -->>- c: page
    c ->>+ auth: login
    auth -->>- c: user id
```

### Create/Update/Delete TODO

Create/Update/Delete operations use Server Actions and Firebase Admin SDK.

```mermaid
sequenceDiagram
    participant u as User
    participant c as Client
    participant s as Server
    participant db as Firestore

    u ->> c: TODO
    c ->> s: TODO
    s ->> db: TODO
```

### Select TODO

Select operation uses realtime update of Firestore client SDK.

```mermaid
sequenceDiagram
    participant u as User
    participant c as Client
    participant db as Firestore

    c ->>+ db: /uses/<uid>/todos
    db -->>- c: todos
    c ->> u: todos
```