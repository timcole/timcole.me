package spotify

import (
	"encoding/json"
	"net/http"
)

// GetPlaying returns the currently playing some over http
func (c *Client) GetPlaying(w http.ResponseWriter, r *http.Request) {
	resp, _ := c.request(V1, "GET", "/me/player", nil, nil, struct {
		Authorization string `url:"authorization"`
	}{Authorization: c.getAuth()})

	var player interface{}
	json.Unmarshal(resp, &player)

	j, _ := json.Marshal(struct {
		Status int         `json:"status"`
		Player interface{} `json:"player"`
	}{Status: 200, Player: player})

	w.Write(j)
}
