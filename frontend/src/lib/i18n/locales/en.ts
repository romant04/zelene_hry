import type { TranslationSchema } from '../types';

const en: TranslationSchema = {
	nav: {
		games: 'Games',
		chat: 'Chat',
		chatRooms: 'Chat rooms',
		privateMessages: 'Private messages',
		friends: 'Friends',
		leaderboard: 'Leaderboard',
		myAccount: 'My account',
		login: 'Sign in',
		logout: 'Sign out',
		userMenu: 'User menu',
		language: 'Language'
	},
	language: {
		cs: 'Čeština',
		en: 'English'
	},
	home: {
		metaDescription:
			'Want to play classic 1v1 online games like Climbers, Prší or Word Football? Find them all in one place',
		heroSubtitle: 'Classic board games, all<br />in one place',
		explore: 'Explore',
		onlineGames: 'Online games',
		onlineGamesDescription:
			'Play online against other people or challenge your<br />friends to a duel'
	},
	auth: {
		loginTitle: 'Duelovky | Sign in',
		registerTitle: 'Duelovky | Sign up',
		login: 'Sign in',
		register: 'Sign up',
		username: 'Username',
		email: 'E-mail',
		password: 'Password',
		passwordAgain: 'Password again',
		noAccount: "Don't have an account yet?",
		hasAccount: 'Already have an account?',
		createAccountHint: 'Create one now and join the active player community',
		loginHint: 'Sign in now so you can keep dueling',
		badCredentials: 'Invalid credentials',
		passwordsMismatch: 'Passwords do not match',
		registrationFailed: 'Registration failed'
	},
	footer: {
		popularGames: 'Popular games',
		wordFootball: 'Word Football',
		climbers: 'Climbers',
		prsi: 'Prší',
		ships: 'Battleships',
		myAccount: 'My account',
		login: 'Sign in',
		register: 'Sign up',
		friends: 'Friends',
		chat: 'Chat',
		contactUs: 'Contact us',
		foundBug: 'Found a bug?',
		email: 'E-mail',
		bugDescription: 'Bug description',
		reportBug: 'Report bug',
		fillAllFields: 'Please fill in all required fields',
		emailSent: 'Thank you for reporting the bug. We will look into it as soon as possible.',
		emailFailed: 'Failed to send the email. Please try again later.'
	},
	friends: {
		pageTitle: 'Duelovky | Friends',
		hubTitle: 'Friends',
		hubSubtitle: 'Manage friends, requests, and find new players',
		findPlayers: 'Find players',
		friendRequests: 'Requests',
		myFriends: 'Friends',
		noFriends: 'You have no friends yet.',
		noRequests: 'No incoming requests.',
		noPlayersFound: 'No players found.',
		removeFriend: 'Remove friend',
		requestSent: 'Request sent',
		addFriend: 'Add friend',
		playerNamePlaceholder: 'Search players…',
		searchLabel: 'Search',
		requestRejected: 'Your friend request to {username} was rejected',
		newRequest: 'You received a new friend request from {username}',
		removedYou: '{username} removed you from their friends',
		newRequestTitle: 'New friend request',
		messageFor: "Message for '{username}'",
		sendRequest: 'Send request',
		requestSentSuccess: 'Friend request sent successfully',
		requestSentError: 'Failed to send friend request',
		removeFriendTitle: "Remove friend '{username}'",
		removeFriendConfirm: 'Do you really want to remove {username} from your friends list?',
		cancel: 'Cancel',
		confirm: 'Confirm',
		friendRemovedSuccess: 'Friend removed successfully',
		friendRemovedError: 'Failed to remove friend',
		accept: 'Accept',
		reject: 'Reject',
		acceptSuccess: 'Friend request accepted successfully',
		acceptError: 'Failed to accept friend request',
		rejectSuccess: 'Friend request rejected'
	},
	leaderboard: {
		pageTitle: 'Duelovky | Leaderboard',
		overall: 'Leaderboard of the best players overall',
		forGame: 'Leaderboard of the best {game} players',
		allGames: 'All games',
		position: 'Position',
		name: 'Name',
		score: 'Score'
	},
	profile: {
		pageTitle: 'Duelovky | My profile',
		role: 'Role',
		playedTime: 'Time played',
		totalMmr: 'Total MMR',
		permissionLevel: 'Permission level',
		totalPlayTime: 'Total play time',
		noGamesPlayed: "You haven't played any games yet",
		goPlay: 'Go play',
		gameStats: 'Game statistics',
		gamesPlayed: '{count} games played'
	},
	notifications: {
		empty: 'No notifications',
		deleteAll: 'Delete all notifications',
		daysAgo_one: '{count} day ago',
		daysAgo_other: '{count} days ago',
		hoursAgo_one: '{count} hour ago',
		hoursAgo_other: '{count} hours ago',
		minutesAgo_one: '{count} minute ago',
		minutesAgo_other: '{count} minutes ago',
		secondsAgo_one: '{count} second ago',
		secondsAgo_other: '{count} seconds ago'
	},
	system: {
		friendRequestAccepted: 'Your friend request to {username} was accepted.',
		friendRequestRejected: 'Your friend request to {username} was rejected.',
		friendRequestReceived: '{username} sent you a friend request.',
		friendRemoved: '{username} removed you from their friends.',
		newDm: 'You received a new message from {username}',
		newChatroomMessage: 'New message in chat room {room} from {username}'
	},
	chat: {
		chats: 'Chats',
		privateChats: 'Private chats',
		chatRooms: 'Chat rooms',
		searchFriend: 'Search for a friend...',
		searchRoom: 'Search for a room...',
		emptyMessage: 'Message cannot be empty',
		deleteMessage: 'Delete message',
		banUser: 'Ban',
		send: 'Send',
		noMessagesYet: "You haven't sent any messages with this user yet",
		notMember: 'You are not a member of this group. Join to start chatting',
		joinRoom: 'Join chat room',
		joinSuccess: 'Successfully joined the chat room',
		joinError: 'An error occurred while joining the chat room',
		bannedTitle: 'You have been banned',
		bannedUntil: 'Your restriction lasts until: {date}',
		bannedContact: 'Contact an administrator if you believe this is a mistake.',
		newRestriction: 'New restriction',
		restrictionHint: 'Enter the required information to create a user restriction',
		restrictionReason: 'Restriction reason',
		restrictionReasonPlaceholder: 'Enter restriction reason',
		restrictionEnd: 'Restriction end (empty = permanent restriction)',
		createRestriction: 'Create restriction',
		restrictionCreated: 'Restriction created successfully.'
	},
	gameDetail: {
		playersInQueue: '{count} players in queue',
		playNow: 'Play now',
		challengeFriend: 'Challenge a friend',
		sessionExpired: 'Your session has expired',
		alreadyInGame:
			'You already have a window open with this game. Please avoid joining multiple games at once.',
		playersOnly: 'Only player accounts can play games.',
		searchingOpponent: 'Looking for an opponent',
		searching: 'Searching ({seconds}s)',
		searchingHint: 'We are looking for the best opponent<br />matching your skill level',
		cancel: 'Cancel',
		creatingLobby: 'Creating private lobby',
		joinLink: 'Link to join the game',
		linkCopied: 'Link copied to clipboard',
		linkCopyFailed: 'Failed to copy link to clipboard',
		joinGameTitle: 'Do you want to join the game?',
		gameCode: 'game code: {code}',
		join: 'Join',
		languageMismatch:
			'This game is played in {language}. Switch the language to {language} to join it.',
		controlsAndPrinciple: 'Controls and game principles',
		controls: 'Controls',
		principle: 'Principles',
		principleHeading: 'Game principles'
	},
	errors: {
		notFound: 'Nothing here...',
		outOfServiceTitle: 'Duelovky | service unavailable',
		outOfService: 'The service is unavailable,<br />please try again later.'
	},
	common: {
		loading: 'Loading...',
		cancel: 'Cancel'
	},
	seo: {
		homeTitle: 'Duelovky – free online games for two players',
		homeDescription:
			'Play 1v1 online games against real opponents: Prší, Word Football and Climbers. Free in your browser, with leaderboards and friend challenges.',
		prsiTitle: 'Prší – Czech card game like Crazy Eights, play online 1v1 | Duelovky',
		prsiDescription:
			'Play Prší, the classic Czech card game similar to Crazy Eights and Uno, online against a real opponent. Ranked matches, leaderboard and private games with friends – free.',
		slovnifotbalTitle: 'Word Football – online word game for two players | Duelovky',
		slovnifotbalDescription:
			'Word Football is a fast 1v1 word game: make English words from the given letters, score goals and beat your opponent in three minutes. Free in your browser.',
		horolezciTitle: 'Climbers – hangman-style word race online 1v1 | Duelovky',
		horolezciDescription:
			'Guess the letters of a hidden phrase and climb to the summit before your opponent. A hangman-style word game for two players, free in your browser.'
	}
};

export default en;
