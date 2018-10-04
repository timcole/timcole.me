package stream

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/TimothyCole/timcole.me/pkg"
	gctx "github.com/gorilla/context"
	"github.com/gorilla/mux"
)

// DeleteChannelCommand allows an auth'ed admin/app create/update a command
func (c *Client) DeleteChannelCommand(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	channel, _ := strconv.Atoi(vars["channel"])
	command, _ := vars["command"]

	var admin = gctx.Get(r, "Admin").(*pkg.Admin)
	// Do they have permissions to manage stream commands for either all channels or the selected one?
	if !admin.Access("MANAGE_STREAM_COMMANDS::*") && !admin.Access("MANAGE_STREAM_COMMANDS::"+vars["channel"]) {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"status": 401, "error": "StatusUnauthorized"}`))
		return
	}

	if len(command) == 0 {
		// Didn't meet the reqs.
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"status": 400, "error": "StatusBadRequest"}`))
		return
	}

	var commands = c.WeetBot.GetChannel(channel)
	var removed = 0
	for _, channelCommand := range commands {
		if command != channelCommand.Command {
			continue
		}

		c.WeetBot.DeleteCommand(channelCommand)
		removed++
	}

	resp, _ := json.Marshal(struct {
		Channel int    `json:"channel"`
		Command string `json:"command"`
		Removed int    `json:"removed"`
	}{
		Channel: channel,
		Command: command,
		Removed: removed,
	})

	w.Write(resp)
}
