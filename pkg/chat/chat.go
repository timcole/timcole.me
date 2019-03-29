package chat

import (
	"strings"
	"time"

	"github.com/TimothyCole/timcole.me/pkg/sockets"
)

type chat struct{}

// New ...
func New(i *sockets.Instance) *chat {
	go updateViewers(i)
	return &chat{}
}

func updateViewers(i *sockets.Instance) {
	ticker := time.NewTicker(time.Second)
	for range ticker.C {
		viewers := 0
		for c := range i.Clients {
			for _, t := range c.Topics {
				if strings.Join(t, ".") == "chat.receive" {
					viewers += 1
				}
			}
		}
		i.Publish([]string{"chat.viewers"}, &sockets.MessagePayload{
			Type: sockets.TypeResponse,
			Data: sockets.MessagePayloadData{
				Topics: []string{"chat.viewers"},
				Data:   viewers,
			},
		})
	}
}
