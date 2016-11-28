include n.Makefile

TEST_APP := "ft-next-video-page-branch-${CIRCLE_BUILD_NUM}"

test: verify

test-smoke-local:
	nht smoke local.ft.com:3002

run:
	nht run --https

provision:
	nht provision ${TEST_APP}
	nht configure ft-next-video-page ${TEST_APP}
	nht deploy-hashed-assets
	nht deploy ${TEST_APP}

tidy:
	nht destroy ${TEST_APP}

deploy:
	nht configure
	nht deploy-hashed-assets --monitor-assets
	nht deploy
