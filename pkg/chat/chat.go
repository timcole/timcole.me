package chat

import "github.com/TimothyCole/timcole.me/pkg/sockets"

type chat struct{}

// New ...
func New(i *sockets.Instance) *chat {
	return &chat{}
}
