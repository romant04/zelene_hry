# Graph Report - zelene_hry  (2026-10-22)

## Corpus Check
- 338 files · ~508,440 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 34 file(s) not represented in the graph (top: (none) 12, .ttf 8, .properties 4)

## Summary
- 1844 nodes · 4722 edges · 85 communities (63 shown, 22 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 170 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `df4a4636`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- addToast
- svelte
- t
- org.springframework.data.jpa.repository.Query
- MainScene
- language-select.svelte
- rooms/+page.ts
- list
- addToast
- GameInfo
- DirectMessage
- SecurityConfiguration.java
- org.springframework.beans.factory.annotation.Autowired
- i18n/index.ts
- i18n/index.ts
- pratele/+page.svelte
- Game
- horolezciLetterPyramid.ts
- svelte
- lombok.Getter
- devDependencies
- [id]/+page.svelte
- lombok.Setter
- lombok.NoArgsConstructor
- phaser
- UserService
- Player
- Account
- FriendRequestId
- stores/toast.ts
- lombok.NoArgsConstructor
- JwtAuthenticationFilter.java
- Seo.svelte
- .setupListeners
- catalog.ts
- horolezci/scene/MainScene.ts
- PrsiCanvas.svelte
- SecurityConfiguration.java
- persistence
- svelte
- org.springframework.http.ResponseEntity
- list
- sockets/src/types/game.ts
- urls.ts
- AccountDto
- ValidPassword
- localizePath
- AccountMinimumDto
- JwtService
- AccountRepository
- prsi/scene/MainScene.ts
- catalog.ts
- devDependencies
- UserService
- game-info.svelte
- FriendRequestId
- JwtAuthenticationFilter.java
- slovniFotbal.ts
- FriendShipId
- friend-list.svelte
- compilerOptions
- PrsiCanvas.svelte
- ChatRestriction
- FriendShipId
- header.svelte
- $app
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
9. `FriendRequest` - 25 edges
10. `AccountMinimumDto` - 25 edges

## Surprising Connections (you probably didn't know these)
- `jsonLd` --calls--> `localizeHref()`  [EXTRACTED]
  frontend/src/routes/(app)/+page.svelte → frontend/src/lib/i18n/index.ts
- `explore` --calls--> `t()`  [EXTRACTED]
  frontend/src/routes/(app)/components/hp-hero.svelte → frontend/src/lib/i18n/index.ts
- `subtitle` --calls--> `t()`  [EXTRACTED]
  frontend/src/routes/(app)/components/hp-hero.svelte → frontend/src/lib/i18n/index.ts
- `headerLinks` --indirect_call--> `t()`  [INFERRED]
  frontend/src/routes/(app)/components/layout/header.svelte → frontend/src/lib/i18n/index.ts
- `alternates` --calls--> `localizePath()`  [EXTRACTED]
  frontend/src/lib/seo/Seo.svelte → frontend/src/lib/i18n/routing.ts

## Import Cycles
- None detected.

## Communities (85 total, 22 thin omitted)

### Community 0 - "addToast"
Cohesion: 0.07
Nodes (39): button, handleMessageDelete(), isOpen, { message, messageType }, mine, inputElement, {
		loading,
		loadingSending,
		username,
		restriction,
		isMemberOfChatroom = $bindable(),
		chatContainer = $bindable(),
		messages,
		sendMessage,
		message = $bindable()
	}, picker (+31 more)

### Community 1 - "svelte"
Cohesion: 0.06
Nodes (28): WEBSOCKET, createChatroomSocket(), createChatSocket(), createFriendsSocket(), createHorolezciSocket(), createMatchmakingSocket(), createPrsiSocket(), createSlovniFotbalSocket() (+20 more)

### Community 2 - "t"
Cohesion: 0.08
Nodes (29): protectedRoutes, localizeHref(), t(), createFriendChallengeSocket(), email, handleSignIn(), handleSignUp(), handleSubmit() (+21 more)

### Community 3 - "org.springframework.data.jpa.repository.Query"
Cohesion: 0.15
Nodes (6): MessageRepository, GameCategoryRepository, GameRepository, LeaderboardEntryDto, MmrRepository, PlayerStatsRepository

### Community 4 - "MainScene"
Cohesion: 0.07
Nodes (9): Balls, FloatingText, createGlowTexture(), Letter, Letters, MainScene, SnakeNode, SlovniFotbalGameState (+1 more)

### Community 5 - "language-select.svelte"
Cohesion: 0.17
Nodes (5): isOpen, {
		onChange
	}, options, selected, {
		isOpen = $bindable(false),
		links,
		isAuthenticated,
		onLocaleChange
	}

### Community 8 - "addToast"
Cohesion: 0.14
Nodes (20): tt, handleJoinChatroom(), sendMessage(), duration, handleAddRestriction(), reason, handleUrlCopy(), handleJoiningMatchmaking() (+12 more)

### Community 9 - "GameInfo"
Cohesion: 0.16
Nodes (7): GameInfoDto, GameInfo, GameInfoTranslation, GameInfoType, CONTROL, GENERAL, GameInfoRepository

### Community 10 - "DirectMessage"
Cohesion: 0.20
Nodes (5): Card, getTextureFromSuit(), MainScene, TurnToken, rnd()

### Community 11 - "SecurityConfiguration.java"
Cohesion: 0.09
Nodes (7): FriendRequestsController, FriendRequest, Friendship, FriendRequestRepository, FriendShipRepository, FriendRequestService, Account

### Community 12 - "org.springframework.beans.factory.annotation.Autowired"
Cohesion: 0.09
Nodes (7): DmController, DmRepository, DmService, FriendShipsController, FriendShipDto, FriendShipService, SocialAggregatorService

### Community 13 - "i18n/index.ts"
Cohesion: 0.15
Nodes (17): dictionaries, getByPath(), interpolate(), translate(), i18n, I18nState, rememberLocale(), cs (+9 more)

### Community 14 - "i18n/index.ts"
Cohesion: 0.11
Nodes (30): formatNotificationMessage(), pluralKey(), createNotificationSocket(), acknowledgeNotifications(), { friend, loading = $bindable() }, handleChatSelect(), unreadMessages, acknowledgeNotifications() (+22 more)

### Community 15 - "pratele/+page.svelte"
Cohesion: 0.09
Nodes (24): activeFriend, activeTab, currentUserId, { data }, didPickInitialTab, filter, findError, findLoading (+16 more)

### Community 16 - "Game"
Cohesion: 0.15
Nodes (6): GameCategoryDto, GameDto, GamePreviewDto, Game, GameCategory, GameTranslation

### Community 17 - "horolezciLetterPyramid.ts"
Cohesion: 0.16
Nodes (11): vitest, letterLines, czechLetterLines, englishLetterLines, generatePyramid(), letterLines, pickLetterOfRank(), pickRankForRow() (+3 more)

### Community 18 - "svelte"
Cohesion: 0.10
Nodes (20): @types/node, @types/socket.io, typescript, uuid, name, private, type, version (+12 more)

### Community 19 - "lombok.Getter"
Cohesion: 0.12
Nodes (8): MessageInputDto, FriendRequestDto, FriendRequestInputDto, MmrChangeDto, NotificationInputDto, SocialDashboardDTO, LoginDto, RegisterDto

### Community 20 - "devDependencies"
Cohesion: 0.07
Nodes (28): devDependencies, autoprefixer, eslint, eslint-config-prettier, eslint-plugin-svelte, globals, @iconify/svelte, @playwright/test (+20 more)

### Community 21 - "[id]/+page.svelte"
Cohesion: 0.09
Nodes (15): resolveGameCode(), { fill, w, h }, { data }, game, gameCode, isChallengeFriendOpen, isFreshData, isJoining (+7 more)

### Community 22 - "lombok.Setter"
Cohesion: 0.13
Nodes (7): ChatDto, ChatsDashboardDto, AccountDto, AdminDto, LoginResponse, RegisterResponse, Admin

### Community 23 - "lombok.NoArgsConstructor"
Cohesion: 0.19
Nodes (6): FriendsDashboardDto, GameCategoryTranslationId, GameInfoTranslationId, GameTranslationId, Mmr, PlayerStats

### Community 25 - "UserService"
Cohesion: 0.12
Nodes (6): GameService, MmrController, MmrService, PlayerStatsController, PlayerStatsService, UserService

### Community 26 - "Player"
Cohesion: 0.16
Nodes (6): MmrDto, MmrInputDto, PlayerStatsDto, PlayerStatsInputDto, PlayerDto, Player

### Community 27 - "Account"
Cohesion: 0.08
Nodes (8): ChatController, ChatInputDto, Chat, Message, ChatRepository, ChatRestrictionService, ChatService, MessageService

### Community 28 - "FriendRequestId"
Cohesion: 0.10
Nodes (4): FriendsPage, LoginPage, RegisterPage, @playwright/test

### Community 29 - "stores/toast.ts"
Cohesion: 0.15
Nodes (9): durationColor, iconColor, toastIcon, { children }, Props, removeToast(), toast, Toast (+1 more)

### Community 31 - "JwtAuthenticationFilter.java"
Cohesion: 0.18
Nodes (11): {
		socket,
		token,
		playerName,
		enemyName
	}, time, distance, { playerName, isEnemy }, safetyPins, HorolezciPlayer, rowToMultiplier(), distanceToTravel (+3 more)

### Community 32 - "Seo.svelte"
Cohesion: 0.07
Nodes (21): SITE_URL, localizeGamePreview(), alternates, canonical, imageUrl, jsonLdScript, OG_LOCALES, Props (+13 more)

### Community 33 - ".setupListeners"
Cohesion: 0.06
Nodes (11): AnimatedCharText, LetterButton, MainScene, Player, Pyramid, SafetyPinButton, Secret, isLetter() (+3 more)

### Community 34 - "catalog.ts"
Cohesion: 0.18
Nodes (16): activeSockets, evaluateAndStartNewRound(), getGameLanguage(), horolezciGameData, newRoundTimer, pickRandomSecret(), roundEndTimer, SECRETS_BY_LANGUAGE (+8 more)

### Community 35 - "horolezci/scene/MainScene.ts"
Cohesion: 0.06
Nodes (29): localizeCategories(), localizeGame(), localizeGameInfo(), activeGameId, activeMMR, activePlayerStats, { games, MMRs, playerStats }, rank (+21 more)

### Community 36 - "PrsiCanvas.svelte"
Cohesion: 0.15
Nodes (8): {
		socket,
		token,
		playerName,
		enemyName
	}, suits, {
		socket,
		token,
		playerName,
		enemyName
	}, time, getGameSize(), isPortrait(), isPortraitScreen(), reloadOnOrientationChange()

### Community 37 - "SecurityConfiguration.java"
Cohesion: 0.10
Nodes (3): ApplicationConfiguration, OpenApiConfig, SecurityConfiguration

### Community 39 - "svelte"
Cohesion: 0.20
Nodes (9): handleRedirect(), open, gameOver, toggleGameOverOff(), toggleGameOverOn(), volume, score, endTime (+1 more)

### Community 40 - "org.springframework.http.ResponseEntity"
Cohesion: 0.10
Nodes (6): GameController, HealthController, SocialDashboardController, TestController, AuthController, UsersController

### Community 41 - "list"
Cohesion: 0.05
Nodes (40): amqplib, cors, nodemon, ts-node, @types/amqplib, @types/express, author, dependencies (+32 more)

### Community 42 - "sockets/src/types/game.ts"
Cohesion: 0.39
Nodes (8): BasePlayer, GeneralGameState, HorolezciGameState, HorolezciPlayer, PrsiGameState, PrsiPlayer, SlovniFotbalGameState, SlovniFotbalPlayer

### Community 43 - "urls.ts"
Cohesion: 0.11
Nodes (23): API, chatsCache, initialChatsCache, { subscribe, set, update }, initialSocialCache, socialCache, { subscribe, set, update }, {
		data
	} (+15 more)

### Community 44 - "AccountDto"
Cohesion: 0.13
Nodes (5): NotificationController, NotificationDto, Notification, NotificationRepository, NotificationService

### Community 45 - "ValidPassword"
Cohesion: 0.18
Nodes (22): socket.io, setupChatNamespace(), setupChatroomNamespace(), users, setupFriendChallengeNamespace(), setupFriendsNamespace(), createNotification(), notifyUser() (+14 more)

### Community 46 - "localizePath"
Cohesion: 0.15
Nodes (20): reroute(), handle(), NOINDEX_ROUTES, detectLocale(), parseLocaleCookie(), DEFAULT_LOCALE, delocalizePath(), GAMES_SEGMENT (+12 more)

### Community 47 - "AccountMinimumDto"
Cohesion: 0.17
Nodes (5): MessageDto, DmDto, DmInputDto, DirectMessage, AccountMinimumDto

### Community 49 - "AccountRepository"
Cohesion: 0.20
Nodes (4): AccountRepository, PlayerRepository, AccountService, AuthService

### Community 50 - "prsi/scene/MainScene.ts"
Cohesion: 0.22
Nodes (9): getTableLayout(), CardData, PrsiGameState, checkForSpecialCards(), isCardPlayable(), isGameInProgress(), setDisconnect(), svrsek (+1 more)

### Community 51 - "catalog.ts"
Cohesion: 0.10
Nodes (26): initialMMRCache, LeaderboardEntry, mmrCache, { subscribe, set, update }, initialProfileCache, profileCache, { subscribe, set, update }, CatalogGame (+18 more)

### Community 52 - "devDependencies"
Cohesion: 0.20
Nodes (12): activeQueues, FriendChallengeQueue, FriendChallengeQueueUser, canUsersMatch(), getUsersFromSameQueue(), matchedUserIds, MatchmakingUser, queueSize (+4 more)

### Community 54 - "UserService"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, checkJs, esModuleInterop, forceConsistentCasingInFileNames, moduleResolution, resolveJsonModule, skipLibCheck (+4 more)

### Community 55 - "game-info.svelte"
Cohesion: 0.22
Nodes (7): TranslateFn, activeTab, { game }, GameInfoType, CONTROL, GENERAL, getGameInfoTypeLabel()

### Community 58 - "slovniFotbal.ts"
Cohesion: 0.12
Nodes (18): dotenv, express, activeSockets, gameoverTimers, MESSAGES, scheduleGameOver(), setupSlovniFotbalNamespace(), SlovniFotbalGameData (+10 more)

### Community 60 - "friend-list.svelte"
Cohesion: 0.14
Nodes (8): friends, {
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
	}, handleChatRedirect(), initial

### Community 62 - "compilerOptions"
Cohesion: 0.20
Nodes (10): scripts, build, check, check:watch, dev, format, lint, preview (+2 more)

### Community 64 - "ChatRestriction"
Cohesion: 0.14
Nodes (5): ChatRestrictionDto, ChatRestrictionInputDto, ChatRestriction, ChatRestrictionId, ChatRestrictionRepository

### Community 65 - "FriendShipId"
Cohesion: 0.20
Nodes (9): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, module, outDir, rootDir, strict, target (+1 more)

### Community 66 - "header.svelte"
Cohesion: 0.06
Nodes (26): getHeaderLinks(), getUserMenuLinks(), headerLinks, isAuthenticated, isOpen, isOpenModal, isOpenNotifications, modal (+18 more)

### Community 67 - "$app"
Cohesion: 0.40
Nodes (3): timer, timeRemaining, disconnect

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
- **34 isolated node(s):** `com.tarnai:duelovky`, `CONTROL`, `GENERAL`, `@sveltejs/adapter-auto`, `@types/eslint` (+29 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 672 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `svelte` connect `svelte` to `addToast`, `svelte`, `header.svelte`, `t`, `PrsiCanvas.svelte`, `language-select.svelte`, `$app`, `addToast`, `urls.ts`, `i18n/index.ts`, `pratele/+page.svelte`, `svelte`, `catalog.ts`, `prsi/scene/MainScene.ts`, `[id]/+page.svelte`, `game-info.svelte`, `stores/toast.ts`, `JwtAuthenticationFilter.java`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `t()` (e.g. with `headerLinks` and `user-menu-modal.svelte`) actually correct?**
  _`t()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `com.tarnai:duelovky`, `CONTROL`, `GENERAL` to the rest of the system?**
  _34 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `addToast` be split into smaller, more focused modules?**
  _Cohesion score 0.07017543859649122 - nodes in this community are weakly interconnected._
- **Why does `socket.io` connect `ValidPassword` to `catalog.ts`, `GameInfo`, `list`, `devDependencies`, `slovniFotbal.ts`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `svelte` be split into smaller, more focused modules?**
  _Cohesion score 0.05975609756097561 - nodes in this community are weakly interconnected._
- **Why does `socket.io-client` connect `JwtAuthenticationFilter.java` to `addToast`, `svelte`, `t`, `PrsiCanvas.svelte`, `svelte`, `addToast`, `urls.ts`, `i18n/index.ts`, `pratele/+page.svelte`, `svelte`, `prsi/scene/MainScene.ts`, `[id]/+page.svelte`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._