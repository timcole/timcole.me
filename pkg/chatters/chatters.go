package chatters

import (
	"strings"

	s "github.com/TimothyCole/timcole.me/pkg/sockets"
)

type chatters struct{}

// New ...
func New(i *s.Instance) *chatters {
	return &chatters{}
}

func (p *chatters) Handler(i *s.Instance, c *s.Client, args []string, payload s.MessagePayload) {
	if len(args) != 1 {
		c.Send <- &s.MessagePayload{Type: s.TypeResponse, Error: s.ErrInvalidTopic}
		return
	}

	var users []*chatter
	for client := range i.Clients {
		for _, t := range client.GetTopics() {
			if strings.Join(t, ".") != "chat.receive" {
				continue
			}

			var alreadyChatting = false
			for _, user := range users {
				if user.ID == client.User.Subject {
					alreadyChatting = true
				}
			}
			if alreadyChatting {
				continue
			}

			users = append(users, &chatter{
				ID:       client.User.Subject,
				Username: client.User.Username,
			})
			continue
		}
	}

	c.Send <- &s.MessagePayload{
		Type: s.TypeResponse,
		Data: s.MessagePayloadData{
			Topics: []string{"chatters"},
			Data:   users,
		},
	}
}

type chatter struct {
	ID       string `json:"id"`
	Username string `json:"username"`
}
