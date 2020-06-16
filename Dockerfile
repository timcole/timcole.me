# Builder
FROM golang:1.14.2-alpine AS builder

RUN apk update && apk add git
RUN apk add build-base

WORKDIR /go/src/app
ADD . /go/src/app

ENV GO111MODULE=on

# Build Backend
RUN go get ./...
RUN GIT_COMMIT=$(git rev-list -1 HEAD) && go build -ldflags "-X main.Version=$GIT_COMMIT" -o website

# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

# Runner
FROM alpine

RUN apk add --no-cache ca-certificates

WORKDIR /app
COPY --from=builder /go/src/app/website /app/website

EXPOSE 6969
ENTRYPOINT [ "./website" ]
