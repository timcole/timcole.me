package spotify

import (
	"encoding/json"
	"time"

	s "github.com/TimothyCole/timcole.me/pkg/sockets"
)

type spotifySocket struct {
	song spotifyResponse
}

// New ...
func New(i *s.Instance) *spotifySocket {
	var ss = &spotifySocket{}
	go ss.updatePlayback(i)
	return ss
}

func (ss *spotifySocket) updatePlayback(i *s.Instance) {
	ticker := time.NewTicker(time.Second)
	for range ticker.C {
		store := i.Store

		resp, _ := request(V1, "GET", "/me/player", nil, nil, struct {
			Authorization string `url:"authorization"`
		}{Authorization: getAuth(store)})

		var player = &Player{}
		json.Unmarshal(resp, &player)
		if player.Item.Name == "" {
			if ss.song.IsPlaying {
				ss.song.IsPlaying = false
				i.Publish([]string{"spotify.playback"}, &s.MessagePayload{
					Type: s.TypeResponse,
					Data: s.MessagePayloadData{
						Topics: []string{"spotify.playback"},
						Data:   ss.song,
					},
				})
			}
			continue
		}

		var artists = []string{}
		for _, artist := range player.Item.Artists {
			artists = append(artists, artist.Name)
		}

		art := ""
		if len(player.Item.Album.Images) > 0 {
			art = player.Item.Album.Images[0].URL
		}

		song := spotifyResponse{
			IsPlaying:  player.IsPlaying,
			Song:       player.Item.Name,
			Artists:    artists,
			Art:        art,
			Link:       player.Item.ExternalUrls.Spotify,
			DurationMS: player.Item.DurationMS,
			ProgressMS: player.ProgressMS,
		}
		if song.IsPlaying == ss.song.IsPlaying && song.Link == ss.song.Link {
			ss.song = song
			continue
		}
		ss.song = song

		i.Publish([]string{"spotify.playback"}, &s.MessagePayload{
			Type: s.TypeResponse,
			Data: s.MessagePayloadData{
				Topics: []string{"spotify.playback"},
				Data:   song,
			},
		})
	}
}

func (ss *spotifySocket) Handler(i *s.Instance, c *s.Client, args []string, payload s.MessagePayload) {
	if len(args) != 2 {
		c.Send <- &s.MessagePayload{Type: s.TypeResponse, Error: s.ErrInvalidTopic}
		return
	}

	switch args[1] {
	case "playback":
		c.Send <- &s.MessagePayload{
			Type: s.TypeResponse,
			Data: s.MessagePayloadData{
				Topics: []string{"spotify.playback"},
				Data:   ss.song,
			},
		}
		c.AddTopics(args)
		break
	default:
		c.Send <- &s.MessagePayload{Type: s.TypeResponse, Error: s.ErrInvalidTopic}
	}
}

type spotifyResponse struct {
	IsPlaying  bool     `json:"is_playing"`
	Song       string   `json:"song"`
	Artists    []string `json:"artists"`
	Art        string   `json:"art"`
	Link       string   `json:"link"`
	DurationMS int64    `json:"duration_ms"`
	ProgressMS int64    `json:"progress_ms"`
}
