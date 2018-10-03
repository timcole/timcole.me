package main

import (
	"net/http"
)

// DiscordInvite redirects them to discords invite
func DiscordInvite(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "https://discordapp.com/invite/YFtfGwq", 301)
}
