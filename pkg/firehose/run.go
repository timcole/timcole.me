package firehose

import (
	"bufio"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync/atomic"
	"time"

	"github.com/TimothyCole/timcole.me/pkg/security"
)

var errRetry = errors.New("retry")

func (f *firehose) run(u *security.User) {
	log.Printf("connecting to firehose triggered by %s", u.Username)
	for {
		err := f.stream()
		if err != errRetry {
			log.Println(err)
		}
		if len(f.instance.Clients) == 0 {
			// If a tree falls in a forest and no one is around to hear it, does it make a sound?
			// Don't reconnect if no one is listening
			break
		}
		time.Sleep(time.Second * 5)
	}
}

func (f *firehose) stream() error {
	req, _ := http.NewRequest(http.MethodGet, "https://tmi.twitch.tv/firehose?oauth_token="+f.token, nil)
	res, err := f.client.Do(req)
	if err != nil {
		log.Println("firehose failed to connect: ", err)
		return errRetry
	} else if res.StatusCode != 200 {
		return fmt.Errorf("unexpected error code %d", res.StatusCode)
	}
	defer res.Body.Close()
	f.data = res.Body

	f.handleStream()
	return errRetry
}

func (f *firehose) handleStream() error {
	var msgCount int32
	keepAlive := time.NewTicker(time.Second * 15)

	defer keepAlive.Stop()

	go func() {
		for range keepAlive.C {
			if atomic.LoadInt32(&msgCount) < 100 {
				f.data.Close()
				f.data = nil
				log.Println("firehose closed because there wasn't any message in a while, will try to reconnect.")
				break
			} else if len(f.instance.Clients) == 0 {
				f.data.Close()
				f.data = nil
				log.Println("firehose closed because no one is connected to the socket.")
				break
			}
			atomic.StoreInt32(&msgCount, 0)
		}
	}()

	reader := bufio.NewReader(f.data)
	for {
		line, err := reader.ReadString('\n')
		if err != nil {
			return err
		}
		if !strings.HasPrefix(line, "data: ") {
			continue
		}
		// removing data: and \r
		msg := line[6 : len(line)-1]
		if msg == "" {
			continue
		}
		atomic.AddInt32(&msgCount, 1)
		f.messages <- msg
	}
}
