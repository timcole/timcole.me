package fossa

import (
	"fmt"
	"net/http"
	"strconv"

	"cloud.google.com/go/datastore"
	gctx "github.com/gorilla/context"
	"github.com/gorilla/mux"
)

// GetPoints returns the number of points for a given user
func GetPoints(w http.ResponseWriter, r *http.Request) {
	var channel = gctx.Get(r, "Channel").(string)
	var vars = mux.Vars(r)
	var user = vars["user"]

	anc := datastore.NameKey("Channels", channel, nil)
	anc.Namespace = ns
	uKey := datastore.NameKey("Points", user, anc)
	uKey.Namespace = ns

	var (
		uChannel Channel
		uChatter ChannelChatter
	)

	if err := client.Get(ctx, anc, &uChannel); err != nil {
		fmt.Println(err)
		w.Write([]byte("@" + user + " doesn't have any points :("))
		return
	}
	if err := client.Get(ctx, uKey, &uChatter); err != nil {
		fmt.Println(err)
		w.Write([]byte("@" + user + " doesn't have any points :("))
		return
	}

	w.Write([]byte("@" + user + ", Currently has " + strconv.Itoa(uChatter.Currency) + " " + uChannel.CurrencyName))
}
