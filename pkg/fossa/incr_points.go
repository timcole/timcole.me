package fossa

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"cloud.google.com/go/datastore"
	gctx "github.com/gorilla/context"
	"github.com/gorilla/mux"
)

// IncrPoints increments everyones points by the set number in the db
func IncrPoints(w http.ResponseWriter, r *http.Request) {
	var channel = gctx.Get(r, "Channel").(string)
	var vars = mux.Vars(r)
	var password = strings.ToLower(vars["password"])

	tmi, err := getChatters(channel)
	if err != nil {
		log.Println(0, err)
		w.Write([]byte("Failed to give everyone points this time BibleThump - Better luck next time."))
		return
	}

	// Group all chatters into one list
	var chatters []string
	chatters = append(chatters, tmi.Chatters.Staff...)
	chatters = append(chatters, tmi.Chatters.Admins...)
	chatters = append(chatters, tmi.Chatters.Moderators...)
	chatters = append(chatters, tmi.Chatters.Vips...)
	chatters = append(chatters, tmi.Chatters.Viewers...)

	anc := datastore.NameKey("Channels", channel, nil)
	anc.Namespace = ns

	// Get channel information from datastore
	var uChannel Channel
	if err := client.Get(ctx, anc, &uChannel); err != nil {
		fmt.Println(1, err)
		w.Write([]byte("Failed to give everyone points this time BibleThump - Better luck next time."))
		return
	}
	if password != strings.ToLower(uChannel.Password) {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Unauthorized"))
	}

	// Get all stored users from Datastore
	users, err := getPoints(anc)
	if err != nil {
		log.Println(2, err)
		w.Write([]byte("Failed to give everyone points this time BibleThump - Better luck next time."))
		return
	}

	var keys []*datastore.Key
	var keyData []*ChannelChatter
	for _, chatter := range chatters {
		k, kd := users.manageCurrency(anc, uChannel.CurrencyGain, chatter)
		keys = append(keys, k)
		keyData = append(keyData, &kd)
	}

	_, err = client.PutMulti(ctx, keys, keyData)
	if err != nil {
		log.Println(3, err)
		w.Write([]byte("Failed to give everyone points this time BibleThump - Better luck next time."))
		return
	}
	w.Write([]byte(""))
}

type currentChatters map[string]ChannelChatter

func getPoints(anc *datastore.Key) (currentChatters, error) {
	query := datastore.NewQuery("Points").Namespace(anc.Namespace).Ancestor(anc)

	var chanChatters []ChannelChatter
	var chanChattersMap = make(map[string]ChannelChatter)
	keys, err := client.GetAll(ctx, query, &chanChatters)
	if err != nil {
		return nil, err
	}

	for i, k := range keys {
		chanChatters[i].Chatter = k.Name
		chanChattersMap[k.Name] = chanChatters[i]
	}

	return chanChattersMap, nil
}

func (cc currentChatters) manageCurrency(anc *datastore.Key, rate int, user string) (*datastore.Key, ChannelChatter) {
	var chatter ChannelChatter
	if cc[user].Chatter == user {
		chatter = cc[user]
		chatter.LastSeen = time.Now()
		chatter.Currency += rate
	} else {
		chatter = ChannelChatter{
			Chatter:   user,
			Currency:  rate,
			FirstSeen: time.Now(),
			LastSeen:  time.Now(),
		}
	}

	key := datastore.NameKey("Points", chatter.Chatter, anc)
	key.Namespace = ns

	return key, chatter
}
