package chat

import (
	s "github.com/TimothyCole/timcole.me/pkg/sockets"
)

func (p *chat) Handler(i *s.Instance, c *s.Client, args []string, payload s.MessagePayload) {
	if len(args) != 2 {
		c.Send <- &s.MessagePayload{Type: s.TypeResponse, Error: s.ErrInvalidTopic}
		return
	}

	if !c.User.Access("NDA") {
		c.Send <- &s.MessagePayload{Type: s.TypeResponse, Error: s.ErrUnauthorized}
		return
	}

	switch args[1] {
	case "send":
		if payload.Data.Data.(string) == "" {
			c.Send <- &s.MessagePayload{Type: s.TypeResponse, Error: s.ErrBadMessage}
			return
		}
		i.Publish([]string{args[0] + ".receive"}, &s.MessagePayload{
			Type: s.TypeResponse,
			Data: s.MessagePayloadData{
				Topics: []string{"chat.send"},
				Data: chatMessage{
					Username: c.User.Username,
					Message:  payload.Data.Data.(string),
				},
			},
		})
		break
	case "receive":
		c.Topics = append(c.Topics, args)
		c.Send <- &s.MessagePayload{Type: s.TypeResponse, Data: s.MessagePayloadData{
			Topics: []string{"chat.receive"},
			Data: chatMessage{
				Username: "",
				Message:  "Welcome to the chat room!",
			},
		}}
		c.Send <- &s.MessagePayload{Type: s.TypeResponse, Data: s.MessagePayloadData{
			Topics: []string{"chat.receive"},
			Data: chatMessage{
				Username: "",
				Message:  "Remember everything in here is confidential information!",
			},
		}}
		break
	case "viewers":
		c.Topics = append(c.Topics, args)
		break
	default:
		c.Send <- &s.MessagePayload{Type: s.TypeResponse, Error: s.ErrInvalidTopic}
	}
}

type chatMessage struct {
	Username string `json:"username"`
	Message  string `json:"message"`
}
