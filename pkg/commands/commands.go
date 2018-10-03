package commands

import (
	"context"
	"fmt"
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
	DBKey     int64  `json:"-" datastore:"-"`
	Channel   int    `json:"channel" datastore:"channel"`
	Command   string `json:"command" datastore:"command"`
	Response  string `json:"response" datastore:"response"`
	Cooldown  int    `json:"cooldown" datastore:"cooldown"`
	Userlevel int    `json:"userlevel" datastore:"userlevel"`
	Points    int    `json:"points" datastore:"points"`
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
	keys, err := client.GetAll(c.ctx, query, &rawCommands)

	for i, r := range keys {
		rawCommands[i].DBKey = r.ID
		commands[rawCommands[i].Channel] = append(commands[rawCommands[i].Channel], rawCommands[i])
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

// SetChannel sets a command for a given channel
func (c *Commands) SetChannel(command Command) Command {
	ctx := context.Background()

	client, err := datastore.NewClient(ctx, "timcole-me")
	if err != nil {
		panic(err)
	}

	key := datastore.IncompleteKey("WeetBot::Commands", nil)
	key, err = client.Put(ctx, key, &command)
	if err != nil {
		fmt.Println(`Error Creating Command`, command, err)
		return Command{}
	}

	c.mutex.Lock()
	command.DBKey = key.ID
	c.commands[command.Channel] = append(c.commands[command.Channel], command)
	c.mutex.Unlock()

	return command
}

// DeleteCommand a command for a given channel
func (c *Commands) DeleteCommand(command Command) bool {
	ctx := context.Background()

	client, err := datastore.NewClient(ctx, "timcole-me")
	if err != nil {
		panic(err)
	}

	key := datastore.IDKey("WeetBot::Commands", command.DBKey, nil)
	err = client.Delete(ctx, key)
	if err != nil {
		fmt.Println(`Error Deleting Command`, command, err)
		return false
	}

	var tempCommands []Command
	var commands = c.commands[command.Channel]
	for i := range commands {
		if commands[i] == command {
			tempCommands = append(commands[:i], commands[i+1:]...)
			break
		}
	}
	c.mutex.Lock()
	c.commands[command.Channel] = tempCommands
	c.mutex.Unlock()

	return true
}
