
run-dev:
	docker-compose --env-file .dev.env up -d --build
run-test:
	docker-compose --env-file .test.env up -d --build
auto-test:
	./run-tests.sh