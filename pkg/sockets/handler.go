package sockets

import (
	"log"
	"net/http"

	"github.com/TimothyCole/timcole.me/pkg/security"
	"github.com/gorilla/context"
)

// Handler is the websocket upgrade handler
func (i *Instance) Handler(w http.ResponseWriter, r *http.Request) {
	socket, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Socket Upgrade Error:", err)
	}

	c := &Client{
		socket: socket,
		Send:   make(chan *MessagePayload),
		User:   context.Get(r, "User").(*security.User),
	}
	i.Register <- c

	if c.User.Username != "" {
		log.Println("New user just connected", c.User.Username)
	} else {
		log.Println("New guest just connected")
	}

	go c.read(i)
	go c.write(i)
}
