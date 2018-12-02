package fossa

import (
	"context"

	"cloud.google.com/go/datastore"
)

var (
	ctx    = context.Background()
	client *datastore.Client
	err    error
	ns     = "FossaBot"
)

func init() {
	if client, err = datastore.NewClient(ctx, "timcole-me"); err != nil {
		panic(err)
	}
}
