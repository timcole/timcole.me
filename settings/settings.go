package settings

import (
	"context"
	"sync"

	"cloud.google.com/go/datastore"
)

// Settings are your settings
type Settings struct {
	mutex sync.Mutex
	kvs   map[string]string
}

type rawKVS struct {
	Key   string `datastore:"key"`
	Value string `datastore:"value"`
}

// InitSettings creates the inital settings
func InitSettings() *Settings {
	var s = &Settings{}
	s.Load()

	return s
}

// Load soads the data from datastore
func (s *Settings) Load() map[string]string {
	var kvs = map[string]string{}
	var rawkvs []*rawKVS

	ctx := context.Background()

	client, err := datastore.NewClient(ctx, "timcole-me")
	if err != nil {
		panic(err)
	}

	query := datastore.NewQuery("Settings")
	_, err = client.GetAll(ctx, query, &rawkvs)

	for _, r := range rawkvs {
		kvs[r.Key] = r.Value
	}

	s.mutex.Lock()
	s.kvs = kvs
	s.mutex.Unlock()

	return kvs
}

// Get gets the value from a key
func (s *Settings) Get(key string) string {
	return s.kvs[key]
}

// Set sets the value from a key
func (s *Settings) Set(key string, value []byte) string {
	ctx := context.Background()

	client, err := datastore.NewClient(ctx, "timcole-me")
	if err != nil {
		panic(err)
	}

	testKey := datastore.IncompleteKey("Settings", nil)
	entry := rawKVS{
		Key:   key,
		Value: string(value),
	}

	client.Put(ctx, testKey, &entry)

	s.mutex.Lock()
	s.kvs[key] = string(value)
	s.mutex.Unlock()

	return s.Get(key)
}
