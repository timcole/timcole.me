package spotify

import (
	config "github.com/TimothyCole/timcole.me/pkg/settings"
)

// Client is a spotify client
type Client struct {
	Settings *config.Settings
}

// NewSpotify creates a new spotify client
func NewSpotify(settings *config.Settings) *Client {
	var c = &Client{
		Settings: settings,
	}

	return c
}
