package spotify

type Player struct {
	Actions              Actions `json:"actions"`
	Context              Context `json:"context"`
	CurrentlyPlayingType string  `json:"currently_playing_type"`
	Device               Device  `json:"device"`
	IsPlaying            bool    `json:"is_playing"`
	Item                 Item    `json:"item"`
	ProgressMS           int64   `json:"progress_ms"`
	RepeatState          string  `json:"repeat_state"`
	ShuffleState         bool    `json:"shuffle_state"`
	Timestamp            int64   `json:"timestamp"`
}

type Actions struct {
	Disallows Disallows `json:"disallows"`
}

type Disallows struct {
	Resuming bool `json:"resuming"`
}

type Context struct {
	ExternalUrls ExternalUrls `json:"external_urls"`
	Href         string       `json:"href"`
	Type         string       `json:"type"`
	URI          string       `json:"uri"`
}

type ExternalUrls struct {
	Spotify string `json:"spotify"`
}

type Device struct {
	ID               string `json:"id"`
	IsActive         bool   `json:"is_active"`
	IsPrivateSession bool   `json:"is_private_session"`
	IsRestricted     bool   `json:"is_restricted"`
	Name             string `json:"name"`
	Type             string `json:"type"`
	VolumePercent    int64  `json:"volume_percent"`
}

type Item struct {
	Album            Album        `json:"album"`
	Artists          []Artist     `json:"artists"`
	AvailableMarkets []string     `json:"available_markets"`
	DiscNumber       int64        `json:"disc_number"`
	DurationMS       int64        `json:"duration_ms"`
	Explicit         bool         `json:"explicit"`
	ExternalIDS      ExternalIDS  `json:"external_ids"`
	ExternalUrls     ExternalUrls `json:"external_urls"`
	Href             string       `json:"href"`
	ID               string       `json:"id"`
	IsLocal          bool         `json:"is_local"`
	Name             string       `json:"name"`
	Popularity       int64        `json:"popularity"`
	PreviewURL       string       `json:"preview_url"`
	TrackNumber      int64        `json:"track_number"`
	Type             string       `json:"type"`
	URI              string       `json:"uri"`
}

type Album struct {
	AlbumType            string       `json:"album_type"`
	Artists              []Artist     `json:"artists"`
	AvailableMarkets     []string     `json:"available_markets"`
	ExternalUrls         ExternalUrls `json:"external_urls"`
	Href                 string       `json:"href"`
	ID                   string       `json:"id"`
	Images               []Image      `json:"images"`
	Name                 string       `json:"name"`
	ReleaseDate          string       `json:"release_date"`
	ReleaseDatePrecision string       `json:"release_date_precision"`
	TotalTracks          int64        `json:"total_tracks"`
	Type                 string       `json:"type"`
	URI                  string       `json:"uri"`
}

type Artist struct {
	ExternalUrls ExternalUrls `json:"external_urls"`
	Href         string       `json:"href"`
	ID           string       `json:"id"`
	Name         string       `json:"name"`
	Type         string       `json:"type"`
	URI          string       `json:"uri"`
}

type Image struct {
	Height int64  `json:"height"`
	URL    string `json:"url"`
	Width  int64  `json:"width"`
}

type ExternalIDS struct {
	Isrc string `json:"isrc"`
}
