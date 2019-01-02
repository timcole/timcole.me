package fossa

import "time"

type Channel struct {
	CreatedAt    time.Time `datastore:"created_at,noindex" json:"created_at"`
	CurrencyGain int       `datastore:"currency_gain,noindex" json:"currency_gain"`
	CurrencyName string    `datastore:"currency_name,noindex" json:"currency_name"`
	Password     string    `datastore:"password,noindex" json:"-"`
}

type ChannelChatter struct {
	Chatter   string    `datastore:"-" json:"chatter"`
	Currency  int       `datastore:"currency,noindex" json:"currency"`
	FirstSeen time.Time `datastore:"first_seen,noindex" json:"first_seen"`
	LastSeen  time.Time `datastore:"last_seen,noindex" json:"last_seen"`
}
