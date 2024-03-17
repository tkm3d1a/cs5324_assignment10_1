# cs5324_assignment10_1

A websocket backed Chat app meant for Assignment 10.1 in CS5324

## Backend design (WIP)

- Simple design, just `ChatUser` and `ChatMessage` are needed to demo websockets
- ChatUser:
  - id
  - username
  - currentStatus
    - created as enum in `enum` package
- ChatMessage:
  - id
  - content
  - createdBy (user_id)
    - mapped as a ManyToOne relationship
    - don't need mapping on user side since we don't really care
    - may even delete this if not really needed for demo purposes
  - createdAt (for ordering in display)
    - secondary option to show a 'chat history' if called for
- No other entities created
- Basic repo and service classes implemented

## Frontend design (WIP)

- Dead simple index and app.js file for controlling websocket connection
- Idea is user can 'sign in (aka connect to websocket)' with a username
- Then can send messages
  - Messages show up in all connected browser windows without needing to refresh page
- Also need to display all currently connected users and their status
  - can possibly expand to 'offline' in the future, but not needed for assignment
- Chat will just appear in raw html table item
- messages just get appended as they appear in the websocket topic
  - idea is to keep it easy and reuse a large portion of the example code from the 'greeting' idea
