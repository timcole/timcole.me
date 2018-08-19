package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	gctx "github.com/gorilla/context"
)

// GetStreamMessage is used to get the waiting message that is displayed on stream
func GetStreamMessage(w http.ResponseWriter, r *http.Request) {
	resp, _ := json.Marshal(struct {
		Message string `json:"messsage"`
	}{Message: settings.Get("STREAM_MESSAGE")})
	w.Write(resp)
}

// SetStreamMessage is used to set the waiting message that is displayed on stream
func SetStreamMessage(w http.ResponseWriter, r *http.Request) {
	var admin = gctx.Get(r, "Admin").(*Admin)
	if !admin.Access("SET_STREAM_MESSAGE") {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"status": 401, "error": "StatusUnauthorized"}`))
		return
	}

	var body struct {
		Message string `json:"message"`
	}
	bod, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(bod, &body)

	if len(body.Message) < 3 {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"status": 400, "error": "StatusBadRequest"}`))
		return
	}

	settings.Set("STREAM_MESSAGE", []byte(body.Message))
	GetStreamMessage(w, r)
}
