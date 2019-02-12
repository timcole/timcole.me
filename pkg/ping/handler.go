package ping

import s "github.com/TimothyCole/timcole.me/pkg/sockets"

func (p *ping) Handler(i *s.Instance, c *s.Client, args []string) {
	if len(args) != 2 {
		c.Send <- &s.MessagePayload{Type: s.TypeResponse, Error: s.ErrInvalidTopic}
		return
	}

	c.Send <- &s.MessagePayload{Type: s.TypeResponse, Data: s.MessagePayloadData{Data: "asd"}}
}
