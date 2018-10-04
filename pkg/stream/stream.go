package stream

import (
	"github.com/TimothyCole/timcole.me/pkg/commands"
	config "github.com/TimothyCole/timcole.me/pkg/settings"
	"github.com/machinebox/graphql"
)

// Client is a stream client
type Client struct {
	Settings *config.Settings
	GraphQL  *graphql.Client
	WeetBot  *commands.Commands
}

// NewStream creates a new stream client
func NewStream(settings *config.Settings, gql *graphql.Client, wb *commands.Commands) *Client {
	var c = &Client{
		Settings: settings,
		GraphQL:  gql,
		WeetBot:  wb,
	}

	return c
}
