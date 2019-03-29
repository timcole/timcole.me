package sockets

// GetTopics returns a clients active topics
func (c *Client) GetTopics() [][]string {
	c.topicsMutex.Lock()
	defer c.topicsMutex.Unlock()

	return c.topics
}

// AddTopics adds a topic to a client
func (c *Client) AddTopics(topic []string) {
	c.topicsMutex.Lock()
	defer c.topicsMutex.Unlock()

	c.topics = append(c.topics, topic)
}

// RemoveTopics removes a topic from a client
func (c *Client) RemoveTopics(removeTopic []string) {
	c.topicsMutex.Lock()
	defer c.topicsMutex.Unlock()

	var removeIndex = -1
	for topicIndex, topic := range c.topics {
		if len(topic) != len(removeTopic) {
			continue
		}

		for i, v := range topic {
			if v != removeTopic[i] {
				continue
			}
		}
		removeIndex = topicIndex
	}
	if removeIndex != -1 {
		c.topics[len(c.topics)-1], c.topics[removeIndex] = c.topics[removeIndex], c.topics[len(c.topics)-1]
		c.topics = c.topics[:len(c.topics)-1]
	}
}
