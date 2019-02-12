package sockets

type wsError string

const (
	// ErrServer tells the client there was a server error
	ErrServer wsError = "ERR_SERVER"
	// ErrBadMessage tells the client that the message they sent isn't supported
	ErrBadMessage wsError = "ERR_BADMESSAGE"
	// ErrUnauthorized tells the client they don't have permissions to access the requested topic
	ErrUnauthorized wsError = "ERR_UNAUTHORIZED"
	// ErrInvalidTopic tells the client the topic they sent isn't valid
	ErrInvalidTopic wsError = "ERR_INVALIDTOPIC"
)
