# Builder
FROM golang:1.11.1-alpine AS builder

RUN apk update && apk add git

WORKDIR /go/src/app
ADD . /go/src/app

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