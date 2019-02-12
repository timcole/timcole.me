package firehose

import (
	"encoding/json"
	"log"
	"strings"

	s "github.com/TimothyCole/timcole.me/pkg/sockets"
)

func (f *firehose) forward() {
	for msg := range f.messages {
		var cevt = &ChannelEvent{}
		if err := json.Unmarshal([]byte(msg), &cevt); err != nil {
			log.Println(err)
			continue
		}

		var target string
		if cevt.Command != "" {
			target = cevt.Target[1:]
		} else {
			cevt.Command = "PRIVMSG"
			target = cevt.Room[1:]
		}
		topic := strings.Join([]string{"firehose", target}, ".")

		f.instance.Publish([]string{topic, "firehose.*"}, &s.MessagePayload{
			Type: s.TypeMessage,
			Data: s.MessagePayloadData{
				Topics: []string{topic},
				Data:   cevt,
			},
		})
	}
}

// ChannelEvent ...
type ChannelEvent struct {
	Command string `json:"command,omitempty"`
	Room    string `json:"room,omitempty"`
	Nick    string `json:"nick,omitempty"`
	Target  string `json:"target,omitempty"`
	Body    string `json:"body,omitempty"`
	Tags    string `json:"tags,omitempty"`
}
