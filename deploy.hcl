job "timcole-me" {
  datacenters = ["rdu"]

  group "timcole-me" {
    count = 1

    update {
      auto_revert  = true
      auto_promote = true
      canary       = 1
    }

    network {
      mode = "bridge"
      port "http" {
        to = -1
      }
    }

    service {
      name = "timcole-me"
      port = "http"

      tags = [
        "traefik.enable=true",
        "traefik.http.routers.timcole.rule=Host(`timcole.me`)",
        "traefik.http.routers.timcole.tls=true",
        "traefik.http.routers.timcole.tls.certresolver=cloudflare",
      ]

      check {
        type     = "http"
        port     = "http"
        path     = "/"
        interval = "2s"
        timeout  = "2s"
      }
    }

    task "timcole-me" {
      driver = "docker"

      env {
        PORT = "${NOMAD_PORT_http}"
      }

      config {
        image = "ghcr.io/timcole/timcole.me:[[.version]]"
        extra_hosts = ["booster:10.10.0.3"]

        auth {
          username = "${DOCKER_USER}"
          password = "${DOCKER_PASS}"
        }
      }

      vault {
        policies = ["ghcr"]
      }

      template {
        data = <<EOH
{{with secret "kv/data/github"}}
DOCKER_USER="{{.Data.data.username}}"
DOCKER_PASS="{{.Data.data.pat}}"
{{end}}
EOH

        destination = "secrets/file.env"
        env         = true
      }

      resources {
        cpu    = 100
        memory = 128
      }
    }
  }
}

