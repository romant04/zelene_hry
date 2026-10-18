# Graph Report - zelene_hry  (2026-10-18)

## Corpus Check
- 326 files · ~401,977 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 34 file(s) not represented in the graph (top: (none) 12, .ttf 8, .properties 4)

## Summary
- 1759 nodes · 4443 edges · 88 communities (62 shown, 26 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 164 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ae9dfa7e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- addToast
- lombok.Getter
- svelte
- MainScene
- Player
- cards.ts
- rooms/+page.ts
- private-chat.svelte
- MainScene
- rank.ts
- DirectMessage
- SecurityConfiguration.java
- ChatController.java
- frontend/package.json
- i18n/index.ts
- src/socket.ts
- .setupListeners
- language-select.svelte
- svelte
- notification-modal.svelte
- devDependencies
- FriendShipDto
- lombok.Setter
- header.svelte
- notblank
- Secret
- FriendsPage
- horolezci/scene/PreloadScene.ts
- FriendRequestId
- horolezci.ts
- lombok.NoArgsConstructor
- JwtAuthenticationFilter.java
- setDisconnect
- lombok.Setter
- catalog.ts
- horolezci/scene/MainScene.ts
- sockets/package.json
- pratele/+page.svelte
- server.ts
- prsi.ts
- org.springframework.stereotype.Service
- list
- matchmaking.ts
- SecurityConfiguration.java
- profile-info.svelte
- ValidPassword
- phaser
- ChatRestriction
- JwtService
- compilerOptions
- t
- devDependencies
- Account
- UserService
- prsi/scene/MainScene.ts
- FriendRequestsController
- game-info.svelte
- scripts
- slovniFotbal/scene/PreloadScene.ts
- OpenApiConfig.java
- compilerOptions
- PrsiCanvas.svelte
- Player
- FriendShipId
- Player
- hooks.server.ts
- sockets/src/types/game.ts
- GameInfo
- tailwind.config.ts
- DuelovkyApplication.java
- dependencies
- DuelovkyApplicationTests.java
- run-tests.sh script
- app.d.ts
- test_urls.ts
- com.tarnai:duelovky
- challenge-friend-overlay.svelte
- Duelovky
- eslint.config.js
- create-svelte
- svelte.config.js
- zebricek/+page.svelte

## God Nodes (most connected - your core abstractions)
1. `Account` - 84 edges
2. `svelte` - 54 edges
3. `UserService` - 43 edges
4. `t()` - 43 edges
5. `User` - 40 edges
6. `AccountDto` - 34 edges
7. `AccountRepository` - 29 edges
8. `addToast()` - 29 edges
9. `Player` - 26 edges
10. `FriendRequest` - 25 edges

## Surprising Connections (you probably didn't know these)
- `games` --calls--> `localizeGamePreview()`  [EXTRACTED]
  frontend/src/routes/(app)/zebricek/+page.svelte → frontend/src/lib/i18n/catalog.ts
- `games` --calls--> `localizeGame()`  [EXTRACTED]
  frontend/src/routes/(app)/profil/+page.svelte → frontend/src/lib/i18n/catalog.ts
- `headerLinks` --indirect_call--> `t()`  [INFERRED]
  frontend/src/routes/(app)/components/layout/header.svelte → frontend/src/lib/i18n/index.ts
- `ChatController` --references--> `ChatRestrictionService`  [EXTRACTED]
  backend/src/main/java/com/tarnai/duelovky/chatGroups/controllers/ChatController.java → backend/src/main/java/com/tarnai/duelovky/chatGroups/services/ChatRestrictionService.java
- `ChatController` --references--> `UserService`  [EXTRACTED]
  backend/src/main/java/com/tarnai/duelovky/chatGroups/controllers/ChatController.java → backend/src/main/java/com/tarnai/duelovky/users/services/UserService.java

## Import Cycles
- None detected.

## Communities (88 total, 26 thin omitted)

### Community 0 - "addToast"
Cohesion: 0.06
Nodes (40): tt, handleJoinChatroom(), email, handleSignIn(), handleSignUp(), handleSubmit(), loading, password (+32 more)

### Community 1 - "lombok.Getter"
Cohesion: 0.11
Nodes (10): GameController, GameCategoryDto, GameDto, GamePreviewDto, GameCategory, GameCategoryTranslation, GameService, AccountMinimumDto (+2 more)

### Community 2 - "svelte"
Cohesion: 0.17
Nodes (20): API, initialMMRCache, mmrCache, MMRCahce, { subscribe, set, update }, initialProfileCache, profileCache, { subscribe, set, update } (+12 more)

### Community 3 - "MainScene"
Cohesion: 0.08
Nodes (8): Balls, FloatingText, Letter, Letters, MainScene, SnakeNode, SlovniFotbalGameState, SlovniFotbalPlayer

### Community 4 - "Player"
Cohesion: 0.12
Nodes (7): MmrController, MmrDto, MmrInputDto, Mmr, MmrId, MmrRepository, MmrService

### Community 6 - "rooms/+page.ts"
Cohesion: 0.11
Nodes (8): chatsCache, initialChatsCache, { subscribe, set, update }, {
		data
	}, FetchedDmData, FetchedChatData, Chatroom, Restriction

### Community 7 - "private-chat.svelte"
Cohesion: 0.06
Nodes (35): button, handleMessageDelete(), isOpen, { message, messageType }, mine, inputElement, {
		loading,
		loadingSending,
		username,
		restriction,
		isMemberOfChatroom = $bindable(),
		chatContainer = $bindable(),
		messages,
		sendMessage,
		message = $bindable()
	}, picker (+27 more)

### Community 8 - "MainScene"
Cohesion: 0.19
Nodes (5): Card, getTextureFromSuit(), MainScene, TurnToken, rnd()

### Community 9 - "rank.ts"
Cohesion: 0.12
Nodes (13): activeGameId, activeMMR, activePlayerStats, { games, MMRs, playerStats }, rank, calculateRank(), RANK, BRONZE (+5 more)

### Community 10 - "DirectMessage"
Cohesion: 0.19
Nodes (4): DmDto, DirectMessage, DmRepository, DmService

### Community 12 - "ChatController.java"
Cohesion: 0.09
Nodes (10): ChatController, ChatDto, ChatInputDto, MessageInputDto, Chat, Message, ChatRepository, MessageRepository (+2 more)

### Community 13 - "frontend/package.json"
Cohesion: 0.10
Nodes (20): @types/node, @types/socket.io, typescript, uuid, name, private, type, version (+12 more)

### Community 14 - "i18n/index.ts"
Cohesion: 0.15
Nodes (20): formatNotificationMessage(), dictionaries, getByPath(), interpolate(), translate(), alignLocaleWithServer(), i18n, I18nState (+12 more)

### Community 15 - "src/socket.ts"
Cohesion: 0.20
Nodes (18): socket.io, setupChatNamespace(), setupChatroomNamespace(), users, createNotification(), notifyUser(), Chatroom, FriendRequest (+10 more)

### Community 16 - ".setupListeners"
Cohesion: 0.19
Nodes (3): MainScene, Pyramid, HorolezciGameState

### Community 17 - "language-select.svelte"
Cohesion: 0.15
Nodes (5): isOpen, {
		onChange
	}, options, selected, {
		isOpen = $bindable(false),
		links,
		isAuthenticated,
		onLocaleChange
	}

### Community 18 - "svelte"
Cohesion: 0.05
Nodes (42): WEBSOCKET, {
		socket,
		token,
		playerName,
		enemyName
	}, time, createChatroomSocket(), createChatSocket(), createFriendsSocket(), createHorolezciSocket(), createMatchmakingSocket() (+34 more)

### Community 19 - "notification-modal.svelte"
Cohesion: 0.09
Nodes (29): acknowledgeNotifications(), { friend, loading = $bindable() }, handleChatSelect(), unreadMessages, acknowledgeNotifications(), handleChatSelect(), { room, loading = $bindable() }, unreadMessages (+21 more)

### Community 20 - "devDependencies"
Cohesion: 0.07
Nodes (28): devDependencies, autoprefixer, eslint, eslint-config-prettier, eslint-plugin-svelte, globals, @iconify/svelte, @playwright/test (+20 more)

### Community 21 - "FriendShipDto"
Cohesion: 0.15
Nodes (5): FriendShipsController, FriendRequestDto, FriendShipDto, FriendShipService, SocialDashboardDTO

### Community 22 - "lombok.Setter"
Cohesion: 0.16
Nodes (6): ChatRestrictionDto, MessageDto, NotificationDto, NotificationInputDto, Notification, AccountDto

### Community 23 - "header.svelte"
Cohesion: 0.12
Nodes (12): getHeaderLinks(), getUserMenuLinks(), headerLinks, isAuthenticated, isOpen, isOpenModal, isOpenNotifications, modal (+4 more)

### Community 24 - "notblank"
Cohesion: 0.12
Nodes (6): DmInputDto, FriendRequestInputDto, MmrChangeDto, PlayerStatsInputDto, LoginDto, RegisterDto

### Community 25 - "Secret"
Cohesion: 0.16
Nodes (5): AnimatedCharText, Secret, isLetter(), SecretWord, SecretWordLine

### Community 26 - "FriendsPage"
Cohesion: 0.10
Nodes (4): FriendsPage, LoginPage, RegisterPage, @playwright/test

### Community 29 - "horolezci.ts"
Cohesion: 0.12
Nodes (21): vitest, activeSockets, evaluateAndStartNewRound(), horolezciGameData, newRoundTimer, pickRandomSecret(), roundEndTimer, setupHorolezciNamespace() (+13 more)

### Community 30 - "lombok.NoArgsConstructor"
Cohesion: 0.20
Nodes (5): ChatRestrictionInputDto, Friendship, GameCategoryTranslationId, GameInfoTranslationId, GameTranslationId

### Community 32 - "setDisconnect"
Cohesion: 0.25
Nodes (4): timer, timeRemaining, disconnect, setDisconnect()

### Community 34 - "catalog.ts"
Cohesion: 0.10
Nodes (18): CatalogGame, categoryEnFallback, codesById, codesByName, enCatalog, localizeCategories(), localizeGame(), localizeGameInfo() (+10 more)

### Community 35 - "horolezci/scene/MainScene.ts"
Cohesion: 0.15
Nodes (11): {
		socket,
		token,
		playerName,
		enemyName
	}, time, distance, { playerName, isEnemy }, safetyPins, HorolezciPlayer, rowToMultiplier(), volume (+3 more)

### Community 36 - "sockets/package.json"
Cohesion: 0.06
Nodes (31): amqplib, cors, nodemon, ts-node, @types/amqplib, @types/express, author, dependencies (+23 more)

### Community 37 - "pratele/+page.svelte"
Cohesion: 0.09
Nodes (32): initialSocialCache, socialCache, { subscribe, set, update }, friends, {
		friendships,
		pageSize = 8,
		friendToBeRemoved = $bindable()
	}, page, pagedFriends, totalPages (+24 more)

### Community 38 - "server.ts"
Cohesion: 0.21
Nodes (8): dotenv, express, app, server, startServer(), initWords(), removeDiacritics(), wordsSet

### Community 39 - "prsi.ts"
Cohesion: 0.23
Nodes (13): activeSockets, CARDS, prepareCardDeck(), PrsiGameData, setupPrsiNamespace(), shuffle(), Card, calculateAndUpdateMMR() (+5 more)

### Community 40 - "org.springframework.stereotype.Service"
Cohesion: 0.16
Nodes (5): ChatRestrictionRepository, ChatRestrictionService, AccountRepository, PlayerRepository, AuthService

### Community 41 - "list"
Cohesion: 0.12
Nodes (7): FriendRequest, FriendRequestRepository, FriendShipRepository, FriendRequestService, GameCategoryRepository, GameInfoRepository, GameRepository

### Community 42 - "matchmaking.ts"
Cohesion: 0.17
Nodes (17): activeQueues, FriendChallengeQueue, FriendChallengeQueueUser, setupFriendChallengeNamespace(), setupFriendsNamespace(), canUsersMatch(), getUsersFromSameGame(), matchedUserIds (+9 more)

### Community 44 - "profile-info.svelte"
Cohesion: 0.14
Nodes (12): colors, darkenColors(), { data }, slices, totalMins, getSumOfPlayedTime(), { user }, { data } (+4 more)

### Community 46 - "phaser"
Cohesion: 0.14
Nodes (3): LetterButton, SafetyPinButton, phaser

### Community 47 - "ChatRestriction"
Cohesion: 0.14
Nodes (4): ChatRestriction, ChatRestrictionId, AdminDto, Admin

### Community 49 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, checkJs, esModuleInterop, forceConsistentCasingInFileNames, moduleResolution, resolveJsonModule, skipLibCheck (+4 more)

### Community 51 - "t"
Cohesion: 0.16
Nodes (7): pluralKey(), t(), explore, subtitle, getTimeDifference(), { children }, Props

### Community 52 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, nodemon, ts-node, @types/amqplib, @types/express, @types/node, @types/socket.io, typescript (+1 more)

### Community 53 - "Account"
Cohesion: 0.09
Nodes (4): NotificationController, NotificationRepository, NotificationService, Account

### Community 54 - "UserService"
Cohesion: 0.08
Nodes (8): DmController, HealthController, SocialDashboardController, SocialAggregatorService, TestController, AuthController, UsersController, UserService

### Community 55 - "prsi/scene/MainScene.ts"
Cohesion: 0.24
Nodes (9): handleRedirect(), CardData, PrsiGameState, checkForSpecialCards(), isCardPlayable(), isGameInProgress(), gameOver, toggleGameOverOff() (+1 more)

### Community 58 - "game-info.svelte"
Cohesion: 0.22
Nodes (7): TranslateFn, activeTab, { game }, GameInfoType, CONTROL, GENERAL, getGameInfoTypeLabel()

### Community 59 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, check, check:watch, dev, format, lint, preview (+2 more)

### Community 62 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, module, outDir, rootDir, strict, target (+1 more)

### Community 63 - "PrsiCanvas.svelte"
Cohesion: 0.18
Nodes (4): {
		socket,
		token,
		playerName,
		enemyName
	}, suits, svrsek, toggleSvrsek()

### Community 66 - "Player"
Cohesion: 0.09
Nodes (9): Game, GameTranslation, PlayerStatsController, PlayerStatsDto, PlayerStats, PlayerStatsRepository, PlayerStatsService, PlayerDto (+1 more)

### Community 67 - "hooks.server.ts"
Cohesion: 0.60
Nodes (3): protectedRoutes, handle(), parseLocaleCookie()

### Community 68 - "sockets/src/types/game.ts"
Cohesion: 0.19
Nodes (15): activeSockets, gameoverTimers, scheduleGameOver(), setupSlovniFotbalNamespace(), SlovniFotbalGameData, isValidWord(), BasePlayer, GeneralGameState (+7 more)

### Community 69 - "GameInfo"
Cohesion: 0.18
Nodes (6): GameInfoDto, GameInfo, GameInfoTranslation, GameInfoType, CONTROL, GENERAL

### Community 71 - "tailwind.config.ts"
Cohesion: 0.38
Nodes (4): duelovky, @skeletonlabs/tw-plugin, tailwindcss, @tailwindcss/typography

### Community 75 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, phaser, @picmo/popup-picker, socket.io-client, @types/socket.io, uuid

### Community 85 - "challenge-friend-overlay.svelte"
Cohesion: 0.10
Nodes (17): createFriendChallengeSocket(), {
		data
	}, LINKS, handleSignOut(), {
		modal = $bindable(),
		isOpen = $bindable()
	}, userMenuLinks, { isOpen = $bindable(), game }, matchId (+9 more)

### Community 87 - "Duelovky"
Cohesion: 0.29
Nodes (6): Duelovky, Funkcionality, Herní, Návod ke spuštění lokálně, Obecné, Technologie

### Community 89 - "eslint.config.js"
Cohesion: 0.33
Nodes (4): eslint-config-prettier, eslint-plugin-svelte, globals, typescript-eslint

### Community 91 - "create-svelte"
Cohesion: 0.40
Nodes (4): Building, create-svelte, Creating a project, Developing

### Community 93 - "svelte.config.js"
Cohesion: 0.40
Nodes (3): config, @sveltejs/adapter-node, @sveltejs/vite-plugin-svelte

### Community 96 - "zebricek/+page.svelte"
Cohesion: 0.09
Nodes (20): { link }, button, handleClick(), handleClickOutside(), {
		isOpenModal = $bindable(),
		modal = $bindable()
	}, isOpen, {
		options,
		value = $bindable(),
		asLinks = false,
		styles,
		optionsColors
	}, selected (+12 more)

## Knowledge Gaps
- **34 isolated node(s):** `com.tarnai:duelovky`, `CONTROL`, `GENERAL`, `@sveltejs/adapter-auto`, `@types/eslint` (+29 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 644 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `svelte` connect `svelte` to `zebricek/+page.svelte`, `addToast`, `svelte`, `horolezci/scene/MainScene.ts`, `setDisconnect`, `pratele/+page.svelte`, `rooms/+page.ts`, `private-chat.svelte`, `frontend/package.json`, `language-select.svelte`, `notification-modal.svelte`, `t`, `challenge-friend-overlay.svelte`, `prsi/scene/MainScene.ts`, `game-info.svelte`, `PrsiCanvas.svelte`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **What connects `com.tarnai:duelovky`, `CONTROL`, `GENERAL` to the rest of the system?**
  _34 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `addToast` be split into smaller, more focused modules?**
  _Cohesion score 0.05805515239477504 - nodes in this community are weakly interconnected._
- **Why does `socket.io-client` connect `svelte` to `addToast`, `horolezci/scene/MainScene.ts`, `pratele/+page.svelte`, `private-chat.svelte`, `frontend/package.json`, `notification-modal.svelte`, `challenge-friend-overlay.svelte`, `prsi/scene/MainScene.ts`, `PrsiCanvas.svelte`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `lombok.Getter` be split into smaller, more focused modules?**
  _Cohesion score 0.10795454545454546 - nodes in this community are weakly interconnected._
- **Why does `socket.io` connect `src/socket.ts` to `sockets/src/types/game.ts`, `sockets/package.json`, `prsi.ts`, `matchmaking.ts`, `horolezci.ts`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `MainScene` be split into smaller, more focused modules?**
  _Cohesion score 0.07510204081632653 - nodes in this community are weakly interconnected._