package main

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/TimothyCole/timcole.me/pkg/commands"

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

// GetChannelCommand returns the commands for a given channel
func GetChannelCommand(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	channel, _ := strconv.Atoi(vars["channel"])
	command := vars["command"]

	var coms []commands.Command
	var channelCommands = weetbot.GetChannel(channel)

	for _, cc := range channelCommands {
		if strings.ToLower(cc.Command) != strings.ToLower(command) {
			continue
		}

		coms = append(coms, cc)
		break
	}

	resp, _ := json.Marshal(struct {
		Data []commands.Command `json:"data"`
	}{Data: coms})

	w.Write(resp)
}
