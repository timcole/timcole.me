package stream

import (
	"bytes"
	"log"
	"net/http"
	"os"
)

func OnPublish(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name")
	call := r.URL.Query().Get("call")
	if name != os.Getenv("STREAM_KEY") && name != os.Getenv("STREAM_KEY")+"_test" {
		w.WriteHeader(401)
		return
	}
	defer w.WriteHeader(200)

	// Don't send notifications if it's just a test
	if name[len(name)-5:] == "_test" {
		return
	}

	var message string
	var colour string
	switch call {
	case "publish":
		message = "Stream Started"
		colour = "5696084"
	case "publish_done":
		message = "Stream Ended"
		colour = "13845315"
	}

	var alert = `
		{"embeds": [{
			"title": "` + message + `",
			"url": "https://timcole.me/nda",
			"color": ` + colour + `
		}]}`

	req, err := http.NewRequest("POST", os.Getenv("STREAM_HOOK"), bytes.NewBuffer([]byte(alert)))
	req.Header.Add("Content-Type", "application/json")
	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		log.Println(err)
		return
	}
	res.Body.Close()
}
