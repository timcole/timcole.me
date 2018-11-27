# Builder
FROM golang:1.11.1-alpine AS builder

RUN apk update && apk add git

WORKDIR /go/src/app
ADD . /go/src/app
RUN go get ./...
RUN cd /go/src/app && go build -o website

# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

# Runner
FROM alpine

RUN apk add --no-cache ca-certificates

WORKDIR /app
COPY --from=builder /go/src/app/website /app/website

EXPOSE 80 443
ENTRYPOINT [ "./website" ]