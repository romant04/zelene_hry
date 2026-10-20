# Graph Report - duelovky  (2026-10-20)

## Corpus Check
- 332 files · ~403,830 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 34 file(s) not represented in the graph (top: (none) 12, .ttf 8, .properties 4)

## Summary
- 1804 nodes · 4550 edges · 94 communities (66 shown, 28 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 170 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `706ac1d2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- addToast
- [id]/+page.svelte
- UserService
- org.springframework.data.jpa.repository.JpaRepository
- MainScene
- header.svelte
- rooms/+page.ts
- private-chat.svelte
- MainScene
- FriendShipService
- DirectMessage
- SecurityConfiguration.java
- AccountRepository
- frontend/package.json
- i18n/index.ts
- src/socket.ts
- lombok.Setter
- GameService
- svelte
- AccountMinimumDto
- devDependencies
- Player
- player-card.svelte
- header.svelte
- phaser
- org.springframework.security.core.Authentication
- org.springframework.http.ResponseEntity
- horolezci/scene/PreloadScene.ts
- FriendRequestId
- svelte
- lombok.NoArgsConstructor
- JwtAuthenticationFilter.java
- setDisconnect
- .setupListeners
- catalog.ts
- horolezci/scene/MainScene.ts
- sockets/package.json
- pratele/+page.svelte
- urls.ts
- Account
- .getUsersBySearchTerm
- list
- matchmaking.ts
- SecurityConfiguration.java
- profile-info.svelte
- ValidPassword
- phaser
- ChatRestriction
- JwtService
- AuthService
- JwtService.java
- t
- devDependencies
- UserService
- SecretWordLine
- @iconify/svelte
- FriendRequestsController
- game-info.svelte
- locale.svelte.ts
- sockets/src/types/user.ts
- compilerOptions
- PrsiCanvas.svelte
- Admin
- FriendShipId
- zebricek/+page.svelte
- prsi/scene/MainScene.ts
- TestController.java
- GameInfo
- gameAssets.ts
- MmrDto
- tailwind.config.ts
- Duelovky
- eslint.config.js
- svelte.config.js
- DuelovkyApplicationTests.java
- dependencies
- run-tests.sh script
- app.d.ts
- test_urls.ts
- +server.ts
- postcss.config.cjs
- lib/index.ts
- com.tarnai:duelovky
- CLAUDE.md
- links.ts
- notifications.svelte
- user-menu.svelte
- select.svelte

## God Nodes (most connected - your core abstractions)
1. `Account` - 86 edges
2. `svelte` - 54 edges
3. `t()` - 43 edges
4. `UserService` - 41 edges
5. `AccountRepository` - 30 edges
6. `addToast()` - 29 edges
7. `Player` - 26 edges
8. `FriendRequest` - 25 edges
9. `AccountMinimumDto` - 25 edges
10. `API` - 25 edges

## Surprising Connections (you probably didn't know these)
- `explore` --calls--> `t()`  [EXTRACTED]
  frontend/src/routes/(app)/components/hp-hero.svelte → frontend/src/lib/i18n/index.ts
- `subtitle` --calls--> `t()`  [EXTRACTED]
  frontend/src/routes/(app)/components/hp-hero.svelte → frontend/src/lib/i18n/index.ts
- `headerLinks` --indirect_call--> `t()`  [INFERRED]
  frontend/src/routes/(app)/components/layout/header.svelte → frontend/src/lib/i18n/index.ts
- `ChatController` --references--> `ChatRestrictionService`  [EXTRACTED]
  backend/src/main/java/com/tarnai/duelovky/chatGroups/controllers/ChatController.java → backend/src/main/java/com/tarnai/duelovky/chatGroups/services/ChatRestrictionService.java
- `ChatController` --references--> `ChatService`  [EXTRACTED]
  backend/src/main/java/com/tarnai/duelovky/chatGroups/controllers/ChatController.java → backend/src/main/java/com/tarnai/duelovky/chatGroups/services/ChatService.java

## Import Cycles
- None detected.

## Communities (94 total, 28 thin omitted)

### Community 0 - "addToast"
Cohesion: 0.07
Nodes (41): button, handleMessageDelete(), isOpen, { message, messageType }, mine, inputElement, {
		loading,
		loadingSending,
		username,
		restriction,
		isMemberOfChatroom = $bindable(),
		chatContainer = $bindable(),
		messages,
		sendMessage,
		message = $bindable()
	}, picker (+33 more)

### Community 1 - "[id]/+page.svelte"
Cohesion: 0.04
Nodes (59): getUserMenuLinks(), WEBSOCKET, resolveGameCode(), createChatroomSocket(), createChatSocket(), createFriendChallengeSocket(), createFriendsSocket(), createHorolezciSocket() (+51 more)

### Community 2 - "UserService"
Cohesion: 0.18
Nodes (3): MmrController, MmrService, UserService

### Community 3 - "org.springframework.data.jpa.repository.JpaRepository"
Cohesion: 0.05
Nodes (18): ChatRestriction, ChatRestrictionId, ChatRestrictionRepository, MessageRepository, DmRepository, FriendRequestId, FriendShipId, GameInfoDto (+10 more)

### Community 4 - "MainScene"
Cohesion: 0.07
Nodes (9): Balls, FloatingText, createGlowTexture(), Letter, Letters, MainScene, SnakeNode, SlovniFotbalGameState (+1 more)

### Community 5 - "header.svelte"
Cohesion: 0.14
Nodes (10): getHeaderLinks(), headerLinks, isAuthenticated, isOpen, isOpenModal, isOpenNotifications, modal, notificationModal (+2 more)

### Community 7 - "private-chat.svelte"
Cohesion: 0.16
Nodes (4): DmInputDto, FriendRequestInputDto, GameInfoTranslation, MmrChangeDto

### Community 8 - "MainScene"
Cohesion: 0.07
Nodes (35): t(), tt, duration, handleAddRestriction(), reason, email, handleSignIn(), handleSignUp() (+27 more)

### Community 10 - "DirectMessage"
Cohesion: 0.17
Nodes (7): Card, getTextureFromSuit(), MainScene, TurnToken, PrsiGameState, isGameInProgress(), rnd()

### Community 11 - "SecurityConfiguration.java"
Cohesion: 0.09
Nodes (9): FriendRequestsController, FriendRequestDto, FriendShipDto, FriendRequest, Friendship, FriendRequestRepository, FriendShipRepository, FriendRequestService (+1 more)

### Community 12 - "AccountRepository"
Cohesion: 0.10
Nodes (7): ChatRepository, ChatRestrictionService, ChatService, MessageService, DmController, DmService, AccountRepository

### Community 13 - "frontend/package.json"
Cohesion: 0.11
Nodes (21): protectedRoutes, handle(), formatNotificationMessage(), dictionaries, getByPath(), interpolate(), translate(), parseLocaleCookie() (+13 more)

### Community 14 - "i18n/index.ts"
Cohesion: 0.14
Nodes (23): pluralKey(), acknowledgeNotifications(), { friend, loading = $bindable() }, handleChatSelect(), unreadMessages, handleJoinChatroom(), acknowledgeNotifications(), handleChatSelect() (+15 more)

### Community 15 - "src/socket.ts"
Cohesion: 0.07
Nodes (38): chatsCache, initialChatsCache, { subscribe, set, update }, initialSocialCache, socialCache, { subscribe, set, update }, {
		data
	}, FetchedDmData (+30 more)

### Community 16 - "lombok.Setter"
Cohesion: 0.13
Nodes (7): FriendsDashboardDto, GameCategoryDto, GameDto, GamePreviewDto, GameCategory, GameCategoryTranslation, GameTranslation

### Community 17 - "GameService"
Cohesion: 0.13
Nodes (5): GameController, GameService, PlayerStatsController, PlayerStatsInputDto, PlayerStatsService

### Community 18 - "svelte"
Cohesion: 0.10
Nodes (20): @types/node, @types/socket.io, typescript, uuid, name, private, type, version (+12 more)

### Community 19 - "AccountMinimumDto"
Cohesion: 0.13
Nodes (6): ChatRestrictionDto, ChatRestrictionInputDto, MessageDto, DmDto, DirectMessage, AccountMinimumDto

### Community 20 - "devDependencies"
Cohesion: 0.07
Nodes (28): devDependencies, autoprefixer, eslint, eslint-config-prettier, eslint-plugin-svelte, globals, @iconify/svelte, @playwright/test (+20 more)

### Community 21 - "Player"
Cohesion: 0.13
Nodes (8): Game, GameCategoryTranslationId, GameInfoTranslationId, GameTranslationId, LocaleUtils, Mmr, PlayerStats, Player

### Community 22 - "player-card.svelte"
Cohesion: 0.15
Nodes (7): friends, {
		friendships,
		currentUserId,
		pageSize = 8,
		friendToBeRemoved = $bindable()
	}, page, pagedFriends, totalPages, {
		friend,
		isFriend,
		activeFriend = $bindable(),
		friendRequestSent,
		friendToBeRemoved = $bindable()
	}, initial

### Community 23 - "header.svelte"
Cohesion: 0.22
Nodes (4): NotificationDto, NotificationInputDto, Notification, AccountDto

### Community 24 - "phaser"
Cohesion: 0.14
Nodes (4): LetterButton, Pyramid, SafetyPinButton, phaser

### Community 26 - "org.springframework.http.ResponseEntity"
Cohesion: 0.14
Nodes (4): HealthController, SocialDashboardController, SocialAggregatorService, UsersController

### Community 27 - "horolezci/scene/PreloadScene.ts"
Cohesion: 0.10
Nodes (6): ChatDto, ChatInputDto, ChatsDashboardDto, MessageInputDto, Chat, Message

### Community 28 - "FriendRequestId"
Cohesion: 0.10
Nodes (4): FriendsPage, LoginPage, RegisterPage, @playwright/test

### Community 29 - "svelte"
Cohesion: 0.12
Nodes (11): durationColor, iconColor, toastIcon, { children }, Props, { children }, Props, removeToast() (+3 more)

### Community 31 - "JwtAuthenticationFilter.java"
Cohesion: 0.13
Nodes (10): distance, { playerName, isEnemy }, safetyPins, Player, HorolezciPlayer, rowToMultiplier(), volume, distanceToTravel (+2 more)

### Community 32 - "setDisconnect"
Cohesion: 0.15
Nodes (4): {
		id,
		image,
		title,
		perex,
		categories
	}, explore, subtitle, { data }

### Community 33 - ".setupListeners"
Cohesion: 0.20
Nodes (3): MainScene, Secret, HorolezciGameState

### Community 34 - "catalog.ts"
Cohesion: 0.12
Nodes (21): vitest, activeSockets, evaluateAndStartNewRound(), horolezciGameData, newRoundTimer, pickRandomSecret(), roundEndTimer, setupHorolezciNamespace() (+13 more)

### Community 35 - "horolezci/scene/MainScene.ts"
Cohesion: 0.18
Nodes (7): activeGameId, activeMMR, activePlayerStats, { games, MMRs, playerStats }, rank, calculateRank(), rankImageMap()

### Community 36 - "sockets/package.json"
Cohesion: 0.11
Nodes (14): timer, timeRemaining, {
		socket,
		token,
		playerName,
		enemyName
	}, time, {
		socket,
		token,
		playerName,
		enemyName
	}, suits, {
		socket,
		token,
		playerName,
		enemyName
	}, time (+6 more)

### Community 38 - "urls.ts"
Cohesion: 0.13
Nodes (25): API, initialMMRCache, LeaderboardEntry, mmrCache, { subscribe, set, update }, initialProfileCache, profileCache, { subscribe, set, update } (+17 more)

### Community 39 - "Account"
Cohesion: 0.14
Nodes (5): LoginDto, LoginResponse, RegisterDto, RegisterResponse, Account

### Community 41 - "list"
Cohesion: 0.05
Nodes (40): amqplib, cors, nodemon, ts-node, @types/amqplib, @types/express, author, dependencies (+32 more)

### Community 42 - "matchmaking.ts"
Cohesion: 0.19
Nodes (15): activeSockets, gameoverTimers, scheduleGameOver(), setupSlovniFotbalNamespace(), SlovniFotbalGameData, isValidWord(), BasePlayer, GeneralGameState (+7 more)

### Community 43 - "SecurityConfiguration.java"
Cohesion: 0.19
Nodes (10): colors, darkenColors(), { data }, slices, totalMins, getSumOfPlayedTime(), { user }, MMR (+2 more)

### Community 44 - "profile-info.svelte"
Cohesion: 0.18
Nodes (3): NotificationController, NotificationRepository, NotificationService

### Community 45 - "ValidPassword"
Cohesion: 0.34
Nodes (11): socket.io, setupChatNamespace(), setupChatroomNamespace(), users, createNotification(), notifyUser(), Message, Notification (+3 more)

### Community 49 - "AuthService"
Cohesion: 0.23
Nodes (3): AuthController, PlayerRepository, AuthService

### Community 50 - "JwtService.java"
Cohesion: 0.15
Nodes (5): isOpen, {
		onChange
	}, options, selected, {
		isOpen = $bindable(false),
		links,
		isAuthenticated,
		onLocaleChange
	}

### Community 51 - "t"
Cohesion: 0.16
Nodes (13): CatalogGame, categoryEnFallback, codesById, codesByName, enCatalog, localizeCategories(), localizeGame(), localizeGameInfo() (+5 more)

### Community 52 - "devDependencies"
Cohesion: 0.18
Nodes (13): activeQueues, FriendChallengeQueue, FriendChallengeQueueUser, canUsersMatch(), getUsersFromSameGame(), matchedUserIds, MatchmakingUser, queueSize (+5 more)

### Community 54 - "UserService"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, checkJs, esModuleInterop, forceConsistentCasingInFileNames, moduleResolution, resolveJsonModule, skipLibCheck (+4 more)

### Community 55 - "SecretWordLine"
Cohesion: 0.21
Nodes (4): AnimatedCharText, isLetter(), SecretWord, SecretWordLine

### Community 56 - "@iconify/svelte"
Cohesion: 0.18
Nodes (7): open, debounceTimeout, { filter = $bindable() }, searchTerm, cupColor, {
		name,
		position,
		MMR,
		styles
	}, @iconify/svelte

### Community 58 - "game-info.svelte"
Cohesion: 0.18
Nodes (12): dotenv, express, setupFriendChallengeNamespace(), setupFriendsNamespace(), setupNotificationNamespace(), app, server, startServer() (+4 more)

### Community 59 - "locale.svelte.ts"
Cohesion: 0.36
Nodes (8): alignLocaleWithServer(), i18n, I18nState, persistLocaleCookie(), readCookieLocale(), readStoredLocale(), setLocale(), syncLocaleFromStorage()

### Community 60 - "sockets/src/types/user.ts"
Cohesion: 0.33
Nodes (7): Chatroom, FriendRequest, Friendship, Admin, MMR, Player, User

### Community 62 - "compilerOptions"
Cohesion: 0.20
Nodes (10): scripts, build, check, check:watch, dev, format, lint, preview (+2 more)

### Community 65 - "FriendShipId"
Cohesion: 0.20
Nodes (9): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, module, outDir, rootDir, strict, target (+1 more)

### Community 66 - "zebricek/+page.svelte"
Cohesion: 0.29
Nodes (7): localizeGamePreview(), games, activeGameId, { data }, games, playersToDisplay, topPlayers

### Community 67 - "prsi/scene/MainScene.ts"
Cohesion: 0.16
Nodes (10): getTableLayout(), CardData, checkForSpecialCards(), isCardPlayable(), isPortrait(), setDisconnect(), gameOver, toggleGameOverOn() (+2 more)

### Community 69 - "GameInfo"
Cohesion: 0.23
Nodes (13): activeSockets, CARDS, prepareCardDeck(), PrsiGameData, setupPrsiNamespace(), shuffle(), Card, calculateAndUpdateMMR() (+5 more)

### Community 71 - "MmrDto"
Cohesion: 0.39
Nodes (4): MmrDto, MmrInputDto, PlayerStatsDto, PlayerDto

### Community 72 - "tailwind.config.ts"
Cohesion: 0.38
Nodes (4): duelovky, @skeletonlabs/tw-plugin, tailwindcss, @tailwindcss/typography

### Community 73 - "Duelovky"
Cohesion: 0.29
Nodes (6): Duelovky, Funkcionality, Herní, Návod ke spuštění lokálně, Obecné, Technologie

### Community 74 - "eslint.config.js"
Cohesion: 0.33
Nodes (4): eslint-config-prettier, eslint-plugin-svelte, globals, typescript-eslint

### Community 75 - "svelte.config.js"
Cohesion: 0.40
Nodes (3): config, @sveltejs/adapter-node, @sveltejs/vite-plugin-svelte

### Community 77 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, phaser, @picmo/popup-picker, socket.io-client, @types/socket.io, uuid

### Community 78 - "run-tests.sh script"
Cohesion: 0.33
Nodes (6): RANK, BRONZE, DIAMOND, GOLD, PLAT, SILVER

### Community 80 - "test_urls.ts"
Cohesion: 0.40
Nodes (4): Building, create-svelte, Creating a project, Developing

### Community 91 - "notifications.svelte"
Cohesion: 0.50
Nodes (4): button, handleClick(), handleClickOutside(), {
		isOpenNotifications = $bindable(),
		modal = $bindable()
	}

### Community 92 - "user-menu.svelte"
Cohesion: 0.50
Nodes (4): button, handleClick(), handleClickOutside(), {
		isOpenModal = $bindable(),
		modal = $bindable()
	}

### Community 93 - "select.svelte"
Cohesion: 0.40
Nodes (3): isOpen, {
		options,
		value = $bindable(),
		asLinks = false,
		styles,
		optionsColors
	}, selected

## Knowledge Gaps
- **34 isolated node(s):** `com.tarnai:duelovky`, `CONTROL`, `GENERAL`, `@sveltejs/adapter-auto`, `@types/eslint` (+29 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 658 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `svelte` connect `addToast` to `[id]/+page.svelte`, `prsi/scene/MainScene.ts`, `sockets/package.json`, `urls.ts`, `MainScene`, `frontend/package.json`, `i18n/index.ts`, `src/socket.ts`, `svelte`, `JwtService.java`, `svelte`, `notifications.svelte`, `user-menu.svelte`, `select.svelte`, `JwtAuthenticationFilter.java`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `t()` (e.g. with `headerLinks` and `user-menu-modal.svelte`) actually correct?**
  _`t()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `com.tarnai:duelovky`, `CONTROL`, `GENERAL` to the rest of the system?**
  _34 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `addToast` be split into smaller, more focused modules?**
  _Cohesion score 0.06821787414066631 - nodes in this community are weakly interconnected._
- **Why does `socket.io-client` connect `[id]/+page.svelte` to `addToast`, `prsi/scene/MainScene.ts`, `sockets/package.json`, `MainScene`, `src/socket.ts`, `svelte`, `JwtAuthenticationFilter.java`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `[id]/+page.svelte` be split into smaller, more focused modules?**
  _Cohesion score 0.03770287141073658 - nodes in this community are weakly interconnected._
- **Why does `phaser` connect `phaser` to `prsi/scene/MainScene.ts`, `sockets/package.json`, `MainScene`, `rooms/+page.ts`, `DirectMessage`, `svelte`, `SecretWordLine`, `PrsiCanvas.svelte`, `lombok.NoArgsConstructor`, `JwtAuthenticationFilter.java`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._