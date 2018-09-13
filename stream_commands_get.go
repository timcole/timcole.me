package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/TimothyCole/timcole.me/commands"

	"github.com/gorilla/mux"
)

// GetCommands returns the commands for a given channel
func GetCommands(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	channel, _ := strconv.Atoi(vars["channel"])

	var coms []commands.Command
	coms = weetbot.GetChannel(channel)

	resp, _ := json.Marshal(struct {
		Data []commands.Command `json:"data"`
	}{Data: coms})

	w.Write(resp)
}
