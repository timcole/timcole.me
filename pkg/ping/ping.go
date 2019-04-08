package ping

import s "github.com/TimothyCole/timcole.me/pkg/sockets"

type ping struct{}

// New ...
func New(i *s.Instance) *ping {
	return &ping{}
}

func (p *ping) Handler(i *s.Instance, c *s.Client, args []string, payload s.MessagePayload) {
	if len(args) != 1 {
		c.Send <- &s.MessagePayload{Type: s.TypeResponse, Error: s.ErrInvalidTopic}
		return
	}

	c.Send <- &s.MessagePayload{
		Type: s.TypeResponse,
		Data: s.MessagePayloadData{
			Topics: []string{"ping"},
			Data:   "pong",
		},
	}
}
