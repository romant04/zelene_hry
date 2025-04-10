
run-dev:
	docker-compose --env-file .dev.env up -d --build
run-tests:
	./run-tests.sh