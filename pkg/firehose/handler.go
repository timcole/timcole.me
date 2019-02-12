package firehose

import (
	s "github.com/TimothyCole/timcole.me/pkg/sockets"
)

func (f *firehose) Handler(i *s.Instance, c *s.Client, args []string) {
	// Bad topic, not enough arguments firehose.channel
	if len(args) != 2 {
		c.Send <- &s.MessagePayload{Type: s.TypeResponse, Error: s.ErrInvalidTopic}
		return
	}

	if c.User.Username == "" {
		c.Send <- &s.MessagePayload{Type: s.TypeResponse, Error: s.ErrUnauthorized}
		return
	}

	c.Topics = append(c.Topics, args)
	c.Send <- &s.MessagePayload{Type: s.TypeResponse}

	if f.data == nil {
		go f.run(c.User)
	}
}
