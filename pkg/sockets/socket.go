package sockets

import (
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
)

const (
	maxMessage = 1000
	maxBuffer  = 1024
)

var (
	closerErrs = []int{websocket.CloseGoingAway, websocket.CloseAbnormalClosure, websocket.CloseNormalClosure, websocket.CloseNoStatusReceived}
	upgrader   = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin:     func(*http.Request) bool { return true },
	}
)

func (c *Client) read(i *Instance) {
	defer func() {
		i.Unregister <- c
		c.socket.Close()
	}()

	c.socket.SetReadLimit(maxMessage)

	for {
		payload := MessagePayload{}
		if err := c.socket.ReadJSON(&payload); err != nil {
			if websocket.IsCloseError(err, closerErrs...) || websocket.IsUnexpectedCloseError(err, closerErrs...) || strings.Contains(err.Error(), "connection reset") {
				break
			}
			c.Send <- &MessagePayload{Type: TypeResponse, Nonce: payload.Nonce, Error: ErrBadMessage}
		}

		if payload.Type == TypeListen || payload.Type == TypeUnlisten {
			if len(payload.Data.Topics) <= 0 {
				c.Send <- &MessagePayload{Type: TypeResponse, Nonce: payload.Nonce, Error: ErrBadMessage}
				continue
			}

			for _, topic := range payload.Data.Topics {
				args := strings.Split(topic, ".")
				if f, ok := i.handlers[args[0]]; ok {
					go f(i, c, args)
				} else {
					c.Send <- &MessagePayload{Type: TypeResponse, Nonce: payload.Nonce, Error: ErrInvalidTopic}
				}
			}
		}
	}
}

func (c *Client) write(i *Instance) {
	defer func() {
		c.socket.Close()
	}()

	for {
		select {
		case msg, ok := <-c.Send:
			if !ok {
				c.socket.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			c.socket.WriteJSON(msg)
		}
	}
}
