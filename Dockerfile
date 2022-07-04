FROM denoland/deno:1.23.1
ARG GITHUB_HASH

WORKDIR /app
ADD . .

ENV DENO_DEPLOYMENT_ID $GIT_HASH

RUN deno cache main.ts

EXPOSE 8000
CMD ["run","-A", "--allow-net","--allow-read","--allow-env","--allow-write","--allow-run","main.ts"]
