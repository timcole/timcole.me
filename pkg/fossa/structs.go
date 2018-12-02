package fossa

import "time"

type Channel struct {
	CreatedAt    time.Time `datastore:"created_at,noindex" json:"created_at"`
	CurrencyGain int       `datastore:"currency_gain,noindex" json:"currency_gain"`
	CurrencyName string    `datastore:"currency_name,noindex" json:"currency_name"`
}

type ChannelChatter struct {
	Currency  int       `datastore:"currency,noindex" json:"currency"`
	Role      string    `datastore:"role,noindex" json:"role"`
	FirstSeen time.Time `datastore:"first_seen,noindex" json:"first_seen"`
	LastSeen  time.Time `datastore:"last_seen,noindex" json:"last_seen"`
}
