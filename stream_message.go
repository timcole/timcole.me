package main

import (
	"encoding/json"
	"net/http"
)

// GetStreamMessage is used to get the waiting message that is displayed on stream
func GetStreamMessage(w http.ResponseWriter, r *http.Request) {
	resp, _ := json.Marshal(struct {
		Message string `json:"messsage"`
	}{Message: settings.Get("STREAM_MESSAGE")})
	w.Write(resp)
}
