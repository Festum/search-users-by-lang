# search-users-by-lang

## Installation

- cd to this project.
- Get a Github [oauth](https://developer.github.com/v3/#authentication) token from [token page](https://github.com/settings/tokens/new) and set it to github.token in `config.json` otherwise you will be [throttled](https://developer.github.com/v3/search/#rate-limit).
- run `docker build -t "github_search_user" .` to setup docker image.
- run `docker run -it --name [CONTAINER_NAME] -p 3000:8080 -d github_search_user` to start this service.
- test code by `docker exec -it [CONTAINER_NAME] npm test`.
- play api by `curl -is http://[DOCKER_MACHINE_IP]:3000/search/[PROGRAMMING_LANGUAGE]`.
  - p.s. you can pass [pagination](https://developer.github.com/v3/#pagination) args to this API.

## Reference

- [Search repositories API](https://developer.github.com/v3/search/#search-repositories)
- [Search users API](https://developer.github.com/v3/search/#search-users)
- [node-nock/nock](https://github.com/node-nock/nock)
