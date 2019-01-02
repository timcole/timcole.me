package fossa

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"time"
)

func getChatters(channel string) (*Chatters, error) {
	req, err := http.NewRequest("GET", "https://tmi.twitch.tv/group/user/"+channel+"/chatters", nil)
	if err != nil {
		return nil, err
	}

	res, err := (&http.Client{Timeout: time.Minute}).Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	var tmi = &Chatters{}
	if err = json.Unmarshal(body, &tmi); err != nil {
		return nil, err
	}

	return tmi, nil
}

// Chatters is the root of chatters from Twitch's TMI
type Chatters struct {
	ChatterCount int64         `json:"chatter_count"`
	Chatters     ChattersClass `json:"chatters"`
}

// ChattersClass are the chatters from Twitch's TMI
type ChattersClass struct {
	Vips       []string `json:"vips"`
	Moderators []string `json:"moderators"`
	Staff      []string `json:"staff"`
	Admins     []string `json:"admins"`
	GlobalMods []string `json:"global_mods"`
	Viewers    []string `json:"viewers"`
}
