package pkg

import (
	config "github.com/TimothyCole/timcole.me/pkg/settings"
)

var settings *config.Settings

func SetSettings(s *config.Settings) {
	settings = s
}
