package ping

import "github.com/TimothyCole/timcole.me/pkg/sockets"

type ping struct{}

// New ...
func New(i *sockets.Instance) *ping {
	return &ping{}
}
