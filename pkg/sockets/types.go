package sockets

type wsType string

const (
	// TypeResponse is used to tell the client they have a response
	// for an action such as listening or unlistening to topics
	TypeResponse wsType = "RESPONSE"
	// TypeMessage tells the client they have a new payload from the server
	TypeMessage wsType = "MESSAGE"
	// TypeListen tells the Server that you want to listen to a set topic(s)
	TypeListen wsType = "LISTEN"
	// TypeUnlisten tells the Server that you want to unlisten to a set topic(s)
	TypeUnlisten wsType = "UNLISTEN"
)
