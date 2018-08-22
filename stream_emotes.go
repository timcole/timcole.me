package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/machinebox/graphql"
)

// GQLEmotes is the response from Twitch's GraphQL for Emotes
type GQLEmotes struct {
	CurrentUser struct {
		DisplayName string `json:"displayName"`
		EmoteSets   []struct {
			Emotes []struct {
				ID    string      `json:"id"`
				SetID string      `json:"setID"`
				State string      `json:"state"`
				Text  interface{} `json:"text"`
				Token string      `json:"token"`
			} `json:"emotes"`
		} `json:"emoteSets"`
	} `json:"currentUser"`
}

// GetEmotes returns WeetBot's Twitch emotes
func GetEmotes(w http.ResponseWriter, r *http.Request) {
	req := graphql.NewRequest(`
		query {
			currentUser {
				displayName
				emoteSets {
					emotes {
						id
						setID
						state
						text
						token
					}
				}
			}
		}
	`)
	req.Header.Set("Authorization", "OAuth "+settings.Get("TWITCH_OAUTH_TOKEN"))

	var data GQLEmotes
	if err := gql.Run(context.Background(), req, &data); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"status": 500, "error": "StatusInternalServerError"}`))
		log.Fatal(err)
		return
	}

	resp, _ := json.Marshal(data.CurrentUser.EmoteSets)
	w.Write(resp)
}
