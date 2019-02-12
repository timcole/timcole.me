package sockets

import (
	"github.com/TimothyCole/timcole.me/pkg/security"
	"github.com/gorilla/websocket"
)

// Instance is a pubsub server instance
type Instance struct {
	Clients    map[*Client]bool
	Inbound    chan []byte
	Register   chan *Client
	Unregister chan *Client
	handlers   map[string]func(*Instance, *Client, []string)
}

// Client is a connection to the Instance
type Client struct {
	socket *websocket.Conn
	Send   chan *MessagePayload
	Topics [][]string
	User   *security.User
}

// MessagePayload is the message from clients to the server and server to clients
type MessagePayload struct {
	Type  wsType             `json:"type"`
	Nonce string             `json:"nonce,omitempty"`
	Error wsError            `json:"error,omitempty"`
	Data  MessagePayloadData `json:"data,omitempty"`
}

// MessagePayloadData is the main data object of the message payload
type MessagePayloadData struct {
	Topics []string    `json:"topics,omitempty"`
	Data   interface{} `json:"data,omitempty"`
}

// New creates a new pubsub instance
func New() *Instance {
	i := &Instance{
		Clients:    make(map[*Client]bool),
		Inbound:    make(chan []byte),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		handlers:   make(map[string]func(*Instance, *Client, []string)),
	}

	return i
}

// AddHandler creates a response function for a given topic
func (i *Instance) AddHandler(q func(*Instance, *Client, []string), topic string) {
	if i.handlers[topic] == nil {
		i.handlers[topic] = q
	}
}

// Start listens for new websocket connections
func (i *Instance) Start() {
	for {
		select {
		case client := <-i.Register:
			i.Clients[client] = true
		case client := <-i.Unregister:
			if _, ok := i.Clients[client]; ok {
				delete(i.Clients, client)
				close(client.Send)
			}
		}
	}
}
