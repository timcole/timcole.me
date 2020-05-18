package pkg

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"time"
)

// Notify returns the channel object for my channel on notify.me
func Notify(w http.ResponseWriter, r *http.Request) {
	url := "https://api.notify.me/secret/channel/username/tim"

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Println(err.Error())
	}

	req.Header.Set("Origin", "https://notify.me")
	req.Header.Set("Authorization", os.Getenv("NOTIFY_KEY"))
	req.Header.Set("User-Agent", "timcole.me homepage")

	res, err := (&http.Client{
		Timeout: 30 * time.Second,
	}).Do(req)
	if err != nil {
		fmt.Println(err.Error())
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err.Error())
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write(body)
}
