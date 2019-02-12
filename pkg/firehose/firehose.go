package firehose

import (
	"io"
	"net/http"
	"os"

	s "github.com/TimothyCole/timcole.me/pkg/sockets"
)

type firehose struct {
	instance *s.Instance
	token    string
	client   *http.Client
	data     io.ReadCloser
	messages chan string
}

// New ...
func New(i *s.Instance) *firehose {
	f := &firehose{
		instance: i,
		token:    os.Getenv("TWITCH_OAUTH"),
		client:   &http.Client{Timeout: 0},
		messages: make(chan string, 5000),
	}

	go f.forward()

	return f
}
