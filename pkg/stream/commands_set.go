package stream

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/TimothyCole/timcole.me/pkg"
	"github.com/TimothyCole/timcole.me/pkg/commands"
	gctx "github.com/gorilla/context"
	"github.com/gorilla/mux"
)

// SetChannelCommand allows an auth'ed admin/app create/update a command
func (c *Client) SetChannelCommand(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	channel, _ := strconv.Atoi(vars["channel"])

	var admin = gctx.Get(r, "Admin").(*pkg.Admin)
	// Do they have permissions to manage stream commands for either all channels or the selected one?
	if !admin.Access("MANAGE_STREAM_COMMANDS::*") && !admin.Access("MANAGE_STREAM_COMMANDS::"+vars["channel"]) {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"status": 401, "error": "StatusUnauthorized"}`))
		return
	}

	var command commands.Command
	body, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(body, &command)
	if err != nil || len(command.Command) == 0 || len(command.Response) == 0 {
		// Didn't meet the reqs.
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"status": 400, "error": "StatusBadRequest"}`))
		return
	}
	command.Channel = channel

	resp, _ := json.Marshal(struct {
		Data commands.Command `json:"data"`
	}{Data: c.WeetBot.SetChannel(command)})

	w.Write(resp)
}
