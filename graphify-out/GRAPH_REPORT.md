# Graph Report - zelene_hry  (2026-10-22)

## Corpus Check
- 338 files · ~508,440 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 34 file(s) not represented in the graph (top: (none) 12, .ttf 8, .properties 4)

## Summary
- 1849 nodes · 4719 edges · 85 communities (59 shown, 26 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 170 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `afc3cbff`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- private-chat.svelte
- svelte
- t
- org.springframework.data.jpa.repository.Query
- Balls
- .getUsersBySearchTerm
- rooms/+page.ts
- list
- chat-section.svelte
- GameInfo
- DirectMessage
- SecurityConfiguration.java
- org.springframework.stereotype.Service
- frontend/src/types/user.ts
- i18n/index.ts
- pratele/+page.svelte
- Game
- horolezciLetterPyramid.ts
- svelte
- lombok.Getter
- devDependencies
- Letters
- Account
- lombok.NoArgsConstructor
- phaser
- UserService
- GameService
- Chat
- FriendRequestId
- org.springframework.beans.factory.annotation.Autowired
- lombok.NoArgsConstructor
- JwtAuthenticationFilter.java
- (app)/+page.svelte
- .setupListeners
- catalog.ts
- horolezci/scene/MainScene.ts
- ChatController
- SecurityConfiguration.java
- SecretWordLine
- svelte
- AccountRepository
- list
- sockets/src/types/game.ts
- rooms/+page.ts
- AccountDto
- ValidPassword
- i18n/index.ts
- AccountMinimumDto
- JwtService
- ApplicationConfiguration.java
- MainScene
- catalog.ts
- devDependencies
- UserService
- JwtService
- JwtAuthenticationFilter.java
- slovniFotbal.ts
- FriendShipId
- friend-list.svelte
- compilerOptions
- PrsiCanvas.svelte
- ChatRestriction
- FriendShipId
- header.svelte
- OpenApiConfig.java
- GameInfo
- tailwind.config.ts
- Duelovky
- eslint.config.js
- svelte.config.js
- DuelovkyApplicationTests.java
- dependencies
- app.d.ts
- test_urls.ts
- +server.ts
- postcss.config.cjs
- lib/index.ts
- com.tarnai:duelovky
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `Account` - 86 edges
2. `svelte` - 54 edges
3. `t()` - 43 edges
4. `UserService` - 41 edges
5. `localizeHref()` - 36 edges
6. `addToast()` - 31 edges
7. `AccountRepository` - 30 edges
8. `Player` - 26 edges
9. `API` - 25 edges
10. `tt` - 25 edges

## Surprising Connections (you probably didn't know these)
- `jsonLd` --calls--> `localizeHref()`  [EXTRACTED]
  frontend/src/routes/(app)/+page.svelte → frontend/src/lib/i18n/index.ts
- `FriendChallengeQueue` --references--> `GameLanguage`  [EXTRACTED]
  sockets/src/namespaces/friendChallenge.ts → sockets/src/types/language.ts
- `handleRemoveFriend()` --calls--> `updateAfterFriendRemoved()`  [INFERRED]
  frontend/src/routes/(app)/pratele/components/remove-friend-modal.svelte → frontend/src/routes/(app)/pratele/+page.svelte
- `getHeaderLinks()` --calls--> `localizeHref()`  [EXTRACTED]
  frontend/src/constants/links.ts → frontend/src/lib/i18n/index.ts
- `getUserMenuLinks()` --calls--> `localizeHref()`  [EXTRACTED]
  frontend/src/constants/links.ts → frontend/src/lib/i18n/index.ts

## Import Cycles
- None detected.

## Communities (85 total, 26 thin omitted)

### Community 0 - "private-chat.svelte"
Cohesion: 0.10
Nodes (20): chatContainer, fetchMessages(), filter, {
		friends,
		chatRooms,
		chatType,
		restrictions,
		currentUserId
	}, init(), isMemberOfChatroom, loading, loadingSending (+12 more)

### Community 1 - "svelte"
Cohesion: 0.04
Nodes (43): WEBSOCKET, createChatroomSocket(), createChatSocket(), createFriendsSocket(), createHorolezciSocket(), createMatchmakingSocket(), createNotificationSocket(), createPrsiSocket() (+35 more)

### Community 2 - "t"
Cohesion: 0.05
Nodes (50): localizeHref(), tt, i18n, I18nState, rememberLocale(), createFriendChallengeSocket(), handleAddRestriction(), email (+42 more)

### Community 3 - "org.springframework.data.jpa.repository.Query"
Cohesion: 0.16
Nodes (8): ChatRepository, MessageRepository, GameCategoryRepository, GameRepository, LeaderboardEntryDto, MmrRepository, NotificationRepository, PlayerStatsRepository

### Community 4 - "Balls"
Cohesion: 0.15
Nodes (3): Balls, FloatingText, SnakeNode

### Community 8 - "chat-section.svelte"
Cohesion: 0.11
Nodes (15): handleJoinChatroom(), inputElement, {
		loading,
		loadingSending,
		username,
		restriction,
		isMemberOfChatroom = $bindable(),
		chatContainer = $bindable(),
		messages,
		sendMessage,
		message = $bindable()
	}, picker, triggerButton, duration, reason, {
		friend,
		isFriend,
		activeFriend = $bindable(),
		friendRequestSent,
		friendToBeRemoved = $bindable()
	} (+7 more)

### Community 9 - "GameInfo"
Cohesion: 0.23
Nodes (6): GameInfoDto, GameInfo, GameInfoType, CONTROL, GENERAL, GameInfoRepository

### Community 10 - "DirectMessage"
Cohesion: 0.14
Nodes (11): Card, getTableLayout(), getTextureFromSuit(), MainScene, TurnToken, CardData, PrsiGameState, checkForSpecialCards() (+3 more)

### Community 11 - "SecurityConfiguration.java"
Cohesion: 0.09
Nodes (6): FriendRequestsController, FriendRequest, FriendRequestId, FriendRequestRepository, FriendShipRepository, FriendRequestService

### Community 12 - "org.springframework.stereotype.Service"
Cohesion: 0.16
Nodes (4): DmController, DirectMessage, DmRepository, DmService

### Community 13 - "frontend/src/types/user.ts"
Cohesion: 0.16
Nodes (13): button, handleMessageDelete(), isOpen, { message, messageType }, mine, restrictionOverlay, ChatMessage, Message (+5 more)

### Community 14 - "i18n/index.ts"
Cohesion: 0.11
Nodes (26): formatNotificationMessage(), pluralKey(), acknowledgeNotifications(), { friend, loading = $bindable() }, handleChatSelect(), unreadMessages, acknowledgeNotifications(), handleChatSelect() (+18 more)

### Community 15 - "pratele/+page.svelte"
Cohesion: 0.06
Nodes (39): initialSocialCache, socialCache, { subscribe, set, update }, { fill, w, h }, {
		friendRequest,
		updateAfterFriendRequest,
		friendSocket
	}, initial, {
		friend = $bindable(),
		friendRequests = $bindable(),
		friendSocket = $bindable()
	}, loading (+31 more)

### Community 16 - "Game"
Cohesion: 0.11
Nodes (7): GameCategoryDto, GameDto, GamePreviewDto, Game, GameCategory, GameTranslation, LocaleUtils

### Community 17 - "horolezciLetterPyramid.ts"
Cohesion: 0.16
Nodes (11): vitest, letterLines, czechLetterLines, englishLetterLines, generatePyramid(), letterLines, pickLetterOfRank(), pickRankForRow() (+3 more)

### Community 18 - "svelte"
Cohesion: 0.10
Nodes (19): @types/node, @types/socket.io, typescript, uuid, name, private, type, version (+11 more)

### Community 19 - "lombok.Getter"
Cohesion: 0.09
Nodes (13): ChatsDashboardDto, DmInputDto, FriendRequestInputDto, FriendsDashboardDto, GameCategoryTranslation, GameInfoTranslation, MmrChangeDto, PlayerStatsDto (+5 more)

### Community 20 - "devDependencies"
Cohesion: 0.07
Nodes (28): devDependencies, autoprefixer, eslint, eslint-config-prettier, eslint-plugin-svelte, globals, @iconify/svelte, @playwright/test (+20 more)

### Community 21 - "Letters"
Cohesion: 0.21
Nodes (3): createGlowTexture(), Letter, Letters

### Community 22 - "Account"
Cohesion: 0.10
Nodes (7): Friendship, NotificationDto, NotificationInputDto, Notification, AccountDto, RegisterResponse, Account

### Community 23 - "lombok.NoArgsConstructor"
Cohesion: 0.16
Nodes (6): GameCategoryTranslationId, GameInfoTranslationId, GameTranslationId, Mmr, PlayerStats, Player

### Community 24 - "phaser"
Cohesion: 0.16
Nodes (3): LetterButton, SafetyPinButton, phaser

### Community 25 - "UserService"
Cohesion: 0.17
Nodes (5): MmrController, MmrDto, MmrInputDto, MmrService, UserService

### Community 26 - "GameService"
Cohesion: 0.12
Nodes (5): GameController, GameService, PlayerStatsController, PlayerStatsInputDto, PlayerStatsService

### Community 27 - "Chat"
Cohesion: 0.11
Nodes (5): ChatDto, ChatInputDto, MessageInputDto, Chat, Message

### Community 28 - "FriendRequestId"
Cohesion: 0.10
Nodes (4): FriendsPage, LoginPage, RegisterPage, @playwright/test

### Community 29 - "org.springframework.beans.factory.annotation.Autowired"
Cohesion: 0.18
Nodes (4): FriendShipsController, FriendShipService, SocialDashboardController, SocialAggregatorService

### Community 31 - "JwtAuthenticationFilter.java"
Cohesion: 0.14
Nodes (14): {
		socket,
		token,
		playerName,
		enemyName
	}, time, distance, { playerName, isEnemy }, safetyPins, HorolezciPlayer, rowToMultiplier(), getGameSize() (+6 more)

### Community 32 - "(app)/+page.svelte"
Cohesion: 0.06
Nodes (22): localizeCategories(), localizeGame(), localizeGameInfo(), localizeGamePreview(), resolveGameCode(), {
		id,
		image,
		title,
		perex,
		categories
	}, isOpen, {
		options,
		value = $bindable(),
		asLinks = false,
		styles,
		optionsColors
	} (+14 more)

### Community 33 - ".setupListeners"
Cohesion: 0.12
Nodes (5): MainScene, Player, Pyramid, Secret, HorolezciGameState

### Community 34 - "catalog.ts"
Cohesion: 0.18
Nodes (16): activeSockets, evaluateAndStartNewRound(), getGameLanguage(), horolezciGameData, newRoundTimer, pickRandomSecret(), roundEndTimer, SECRETS_BY_LANGUAGE (+8 more)

### Community 35 - "horolezci/scene/MainScene.ts"
Cohesion: 0.07
Nodes (23): activeGameId, activeMMR, activePlayerStats, { games, MMRs, playerStats }, rank, colors, darkenColors(), { data } (+15 more)

### Community 36 - "ChatController"
Cohesion: 0.17
Nodes (3): ChatController, ChatService, MessageService

### Community 38 - "SecretWordLine"
Cohesion: 0.20
Nodes (4): AnimatedCharText, isLetter(), SecretWord, SecretWordLine

### Community 39 - "svelte"
Cohesion: 0.09
Nodes (18): timer, timeRemaining, handleRedirect(), open, {
		socket,
		token,
		playerName,
		enemyName
	}, suits, {
		socket,
		token,
		playerName,
		enemyName
	}, time (+10 more)

### Community 40 - "AccountRepository"
Cohesion: 0.12
Nodes (5): TestController, AuthController, AccountRepository, PlayerRepository, AuthService

### Community 41 - "list"
Cohesion: 0.05
Nodes (40): amqplib, cors, nodemon, ts-node, @types/amqplib, @types/express, author, dependencies (+32 more)

### Community 42 - "sockets/src/types/game.ts"
Cohesion: 0.39
Nodes (8): BasePlayer, GeneralGameState, HorolezciGameState, HorolezciPlayer, PrsiGameState, PrsiPlayer, SlovniFotbalGameState, SlovniFotbalPlayer

### Community 43 - "rooms/+page.ts"
Cohesion: 0.30
Nodes (10): chatsCache, initialChatsCache, { subscribe, set, update }, FetchedDmData, FriendsDashboard, ChatsDashboard, FetchedChatData, Chatroom (+2 more)

### Community 45 - "ValidPassword"
Cohesion: 0.18
Nodes (22): socket.io, setupChatNamespace(), setupChatroomNamespace(), users, setupFriendChallengeNamespace(), setupFriendsNamespace(), createNotification(), notifyUser() (+14 more)

### Community 46 - "i18n/index.ts"
Cohesion: 0.06
Nodes (52): protectedRoutes, SITE_URL, reroute(), handle(), NOINDEX_ROUTES, dictionaries, getByPath(), interpolate() (+44 more)

### Community 47 - "AccountMinimumDto"
Cohesion: 0.19
Nodes (6): MessageDto, DmDto, FriendRequestDto, FriendShipDto, SocialDashboardDTO, AccountMinimumDto

### Community 50 - "MainScene"
Cohesion: 0.22
Nodes (4): MainScene, SlovniFotbalGameState, SlovniFotbalPlayer, setDisconnect()

### Community 51 - "catalog.ts"
Cohesion: 0.10
Nodes (29): API, initialMMRCache, LeaderboardEntry, mmrCache, { subscribe, set, update }, initialProfileCache, profileCache, { subscribe, set, update } (+21 more)

### Community 52 - "devDependencies"
Cohesion: 0.20
Nodes (12): activeQueues, FriendChallengeQueue, FriendChallengeQueueUser, canUsersMatch(), getUsersFromSameQueue(), matchedUserIds, MatchmakingUser, queueSize (+4 more)

### Community 54 - "UserService"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, checkJs, esModuleInterop, forceConsistentCasingInFileNames, moduleResolution, resolveJsonModule, skipLibCheck (+4 more)

### Community 58 - "slovniFotbal.ts"
Cohesion: 0.12
Nodes (18): dotenv, express, activeSockets, gameoverTimers, MESSAGES, scheduleGameOver(), setupSlovniFotbalNamespace(), SlovniFotbalGameData (+10 more)

### Community 60 - "friend-list.svelte"
Cohesion: 0.25
Nodes (5): friends, {
		friendships,
		currentUserId,
		pageSize = 8,
		friendToBeRemoved = $bindable()
	}, page, pagedFriends, totalPages

### Community 62 - "compilerOptions"
Cohesion: 0.20
Nodes (10): scripts, build, check, check:watch, dev, format, lint, preview (+2 more)

### Community 64 - "ChatRestriction"
Cohesion: 0.13
Nodes (7): ChatRestrictionDto, ChatRestrictionInputDto, ChatRestriction, ChatRestrictionId, ChatRestrictionRepository, ChatRestrictionService, Admin

### Community 65 - "FriendShipId"
Cohesion: 0.20
Nodes (9): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, module, outDir, rootDir, strict, target (+1 more)

### Community 66 - "header.svelte"
Cohesion: 0.05
Nodes (31): getHeaderLinks(), getUserMenuLinks(), t(), explore, subtitle, headerLinks, isAuthenticated, isOpen (+23 more)

### Community 69 - "GameInfo"
Cohesion: 0.20
Nodes (15): activeSockets, CARDS, prepareCardDeck(), PrsiGameData, setupPrsiNamespace(), shuffle(), GameRoomsMap, Card (+7 more)

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

### Community 80 - "test_urls.ts"
Cohesion: 0.40
Nodes (4): Building, create-svelte, Creating a project, Developing

## Knowledge Gaps
- **34 isolated node(s):** `@types/node`, `@types/socket.io`, `typescript`, `uuid`, `autoprefixer` (+29 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 677 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `svelte` connect `svelte` to `private-chat.svelte`, `svelte`, `header.svelte`, `t`, `(app)/+page.svelte`, `chat-section.svelte`, `DirectMessage`, `rooms/+page.ts`, `frontend/src/types/user.ts`, `i18n/index.ts`, `pratele/+page.svelte`, `i18n/index.ts`, `svelte`, `catalog.ts`, `JwtAuthenticationFilter.java`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `t()` (e.g. with `headerLinks` and `user-menu-modal.svelte`) actually correct?**
  _`t()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@types/node`, `@types/socket.io`, `typescript` to the rest of the system?**
  _34 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `private-chat.svelte` be split into smaller, more focused modules?**
  _Cohesion score 0.09538461538461539 - nodes in this community are weakly interconnected._
- **Why does `socket.io-client` connect `svelte` to `private-chat.svelte`, `t`, `svelte`, `DirectMessage`, `pratele/+page.svelte`, `svelte`, `JwtAuthenticationFilter.java`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `svelte` be split into smaller, more focused modules?**
  _Cohesion score 0.04475703324808184 - nodes in this community are weakly interconnected._
- **Why does `socket.io` connect `ValidPassword` to `catalog.ts`, `GameInfo`, `list`, `devDependencies`, `slovniFotbal.ts`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._