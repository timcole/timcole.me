package chat

import (
	"strings"
	"time"

	"github.com/TimothyCole/timcole.me/pkg/sockets"
)

type chat struct {
	viewers int
}

// New ...
func New(i *sockets.Instance) *chat {
	c := &chat{}
	go c.updateViewers(i)
	return c
}

func (c *chat) updateViewers(i *sockets.Instance) {
	ticker := time.NewTicker(time.Second)
	for range ticker.C {
		viewers := 0
		for c := range i.Clients {
			for _, t := range c.GetTopics() {
				if strings.Join(t, ".") == "chat.receive" {
					viewers += 1
				}
			}
		}

		if c.viewers == viewers {
			continue
		}
		c.viewers = viewers

		i.Publish([]string{"chat.viewers"}, &sockets.MessagePayload{
			Type: sockets.TypeResponse,
			Data: sockets.MessagePayloadData{
				Topics: []string{"chat.viewers"},
				Data:   viewers,
			},
		})
	}
}
