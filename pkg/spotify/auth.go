package spotify

import (
	"encoding/base64"
	"encoding/json"
	"log"
	"os"
	"strings"

	"github.com/go-redis/redis"
)

type authJSON struct {
	Token   string `json:"token"`
	Refresh string `json:"refresh"`
}

type tokenResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int    `json:"expires_in"`
	Scope       string `json:"scope"`
}

// getAuth returns a bearer token
func getAuth(store *redis.Client) string {
	var token string
	var tokenResp *tokenResponse

	var auth = authJSON{}
	authRaw, err := store.Get("user.tim.spotify").Result()
	if err != nil {
		log.Println("Spotify auth error", err)
	}
	json.Unmarshal([]byte(authRaw), &auth)

	resp, _ := request(V1, "GET", "/me", nil, nil, struct {
		Authorization string `url:"authorization"`
	}{Authorization: "Bearer " + auth.Token})
	meResp := string(resp)
	if !strings.Contains(meResp, "error") {
		token = "Bearer " + auth.Token
		return token
	}

	resp, _ = request(Accounts, "POST", "/token", nil, struct {
		GrantType    string `url:"grant_type"`
		RefreshToken string `url:"refresh_token"`
	}{GrantType: "refresh_token", RefreshToken: auth.Refresh}, struct {
		Authorization string `url:"authorization"`
		ContentType   string `url:"content-type"`
	}{
		Authorization: "Basic " + base64.StdEncoding.EncodeToString([]byte(os.Getenv("SPOTIFY_CLIENT_ID")+":"+os.Getenv("SPOTIFY_CLIENT_SECRET"))),
		ContentType:   "application/x-www-form-urlencoded",
	})
	json.Unmarshal(resp, &tokenResp)

	if tokenResp.AccessToken != "" {
		auth.Token = tokenResp.AccessToken
		j, _ := json.Marshal(auth)
		if err := store.Set("user.tim.spotify", string(j), 0).Err(); err != nil {
			log.Println("Spotify auth error", err)
		}

		token = "Bearer " + auth.Token
	}

	return token
}
