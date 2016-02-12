# Skypager.io Server

This is a simple server for a skypager project that is based on deepstream.io, and redis.

The idea is simple, a project has an authoritative copy that exists somewhere, and this project 
lives along side its own server.

Web Applications for example can interact with this server.

Under the hood it is powered by deeptream.io, which provides an authentication and permissioning layer
that is be tied directly to the skypager project settings. Deepstream.io is not the database or system or record,
it is just a cache and real time communications broker for connected clients. 

Everytime the Skypager project exports a new version of itself, it is is automatically refreshed in the Cache and
any connected clients or subscribers can get updated and check for new content if they wish.
