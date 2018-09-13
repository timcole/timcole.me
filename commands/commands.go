package commands

import (
	"context"
	"sync"

	"cloud.google.com/go/datastore"
)

// Commands are commands for WeetBot
type Commands struct {
	mutex    sync.Mutex
	ctx      context.Context
	commands map[int][]Command
}

// Command is a weetbot command
type Command struct {
	Channel   int    `json:"channel" datastore:"channel"`
	Command   string `json:"command" datastore:"command"`
	Response  string `json:"response" datastore:"response"`
	Cooldown  int    `json:"cooldown" datastore:"cooldown"`
	Userlevel int    `json:"userlevel" datastore:"userlevel"`
	Point     int    `json:"point" datastore:"point"`
	Hidden    bool   `json:"hidden" datastore:"hidden"`
}

// InitCommands creates the inital commands
func InitCommands() *Commands {
	var s = &Commands{}
	s.ctx = context.Background()
	s.Load()

	return s
}

// Load soads the data from datastore
func (c *Commands) Load() map[int][]Command {
	var commands = make(map[int][]Command)
	var rawCommands []Command

	client, err := datastore.NewClient(c.ctx, "timcole-me")
	if err != nil {
		panic(err)
	}

	query := datastore.NewQuery("WeetBot::Commands")
	_, err = client.GetAll(c.ctx, query, &rawCommands)

	for _, command := range rawCommands {
		commands[command.Channel] = append(commands[command.Channel], command)
	}

	c.mutex.Lock()
	c.commands = commands
	c.mutex.Unlock()

	return commands
}

// GetChannel gets all the commands for a given channel
func (c *Commands) GetChannel(channel int) []Command {
	var commands []Command

	c.mutex.Lock()
	commands = c.commands[channel]
	c.mutex.Unlock()

	if commands == nil {
		return make([]Command, 0)
	}

	return commands
}
