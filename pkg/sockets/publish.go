package sockets

import "strings"

// Publish publishes a message to all the connected clients listening to a set topic(s)
func (i *Instance) Publish(topics []string, data *MessagePayload) {
	for c := range i.Clients {
		for _, t := range c.GetTopics() {
			for _, topic := range topics {
				if topic == strings.Join(t, ".") {
					c.Send <- data
				}
			}
		}
	}
}
