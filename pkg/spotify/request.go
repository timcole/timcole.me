package spotify

import (
	"bytes"
	"io/ioutil"
	"net/http"

	"github.com/google/go-querystring/query"
)

// BaseURL is the endpoint for the API
type BaseURL string

const (
	// V1 is the V1 API
	V1 = BaseURL("https://api.spotify.com/v1")
	// Accounts is the accounts auth api
	Accounts = BaseURL("https://accounts.spotify.com/api")
)

func request(base BaseURL, method, uri string, q, b, h interface{}) ([]byte, error) {
	var qs = ""
	if q != nil {
		q, err := query.Values(q)
		if err == nil {
			qs = qs + "?" + q.Encode()
		}
	}

	var postBody = ""
	if b != nil {
		b, err := query.Values(b)
		if err == nil {
			postBody = b.Encode()
		}
	}

	req, err := http.NewRequest(method, string(base)+uri+qs, bytes.NewBuffer([]byte(postBody)))
	if err != nil {
		return []byte(""), err
	}

	if h != nil {
		headers, _ := query.Values(h)
		for header := range headers {
			req.Header.Set(header, headers.Get(header))
		}
	}

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return []byte(""), err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return []byte(""), err
	}

	return body, nil
}
