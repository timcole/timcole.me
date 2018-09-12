package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/machinebox/graphql"
	"google.golang.org/appengine"
	"google.golang.org/appengine/memcache"
)

// GQLEmotes is the response from Twitch's GraphQL for Emotes
type GQLEmotes struct {
	CurrentUser struct {
		DisplayName string `json:"displayName"`
		Cache       int64  `json:"cache"`
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
	ctx := appengine.BackgroundContext()
	cacheKey := "WeetBot::Emotes"
	var data GQLEmotes

	if cache, err := memcache.Get(ctx, cacheKey); err == nil {
		if err := json.Unmarshal(cache.Value, &data.CurrentUser); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(`{"status": 500, "error": "StatusInternalServerError"}`))
			log.Fatal(err)
			return
		}

		// Has the cache expired yet?
		if data.CurrentUser.Cache-time.Now().UTC().Unix() > 0 {
			// Cache is okay
			w.Write(cache.Value)
			return
		} // Cache is expired
	}

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

	if err := gql.Run(context.Background(), req, &data); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"status": 500, "error": "StatusInternalServerError"}`))
		log.Fatal(err)
		return
	}

	data.CurrentUser.Cache = time.Now().UTC().Add(30 * time.Minute).Unix()
	resp, _ := json.Marshal(data.CurrentUser)

	item := &memcache.Item{
		Key:   cacheKey,
		Value: resp,
	}
	memcache.Set(ctx, item)

	w.Write(resp)
}
