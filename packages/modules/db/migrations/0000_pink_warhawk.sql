CREATE TABLE `authenticator` (
	`credentialID` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`credentialPublicKey` varchar(255) NOT NULL,
	`counter` int NOT NULL,
	`credentialDeviceType` varchar(255) NOT NULL,
	`credentialBackedUp` boolean NOT NULL,
	`transports` varchar(255),
	CONSTRAINT `authenticator_userId_credentialID_pk` PRIMARY KEY(`userId`,`credentialID`),
	CONSTRAINT `authenticator_credentialID_unique` UNIQUE(`credentialID`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `sessions_sessionToken` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `account` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` varchar(255),
	`access_token` varchar(255),
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` varchar(2048),
	`session_state` varchar(255),
	CONSTRAINT `account_provider_providerAccountId_pk` PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`public_id` char(28) NOT NULL,
	`created_at` timestamp,
	`last_login_at` timestamp,
	`password_hash` varchar(255),
	`two_factor_secret` varchar(255),
	`two_factor_enabled` boolean NOT NULL DEFAULT false,
	`recovery_code` varchar(256),
	`pre_account` boolean NOT NULL DEFAULT true,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp(3),
	`image` varchar(255),
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `verificationToken_identifier_token_pk` PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
CREATE TABLE `org_invitations` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` char(29) NOT NULL,
	`org_id` bigint unsigned NOT NULL,
	`invited_by_org_member_id` bigint unsigned NOT NULL,
	`role` enum('admin','member') NOT NULL,
	`org_member_id` bigint unsigned,
	`invited_org_member_profile_id` bigint unsigned,
	`email` varchar(128),
	`invite_token` varchar(64),
	`invited_at` timestamp NOT NULL,
	`expires_at` timestamp,
	`accepted_at` timestamp,
	CONSTRAINT `org_invitations_id` PRIMARY KEY(`id`),
	CONSTRAINT `public_id_idx` UNIQUE(`public_id`),
	CONSTRAINT `org_member_id_idx` UNIQUE(`org_member_id`),
	CONSTRAINT `org_email_unique_idx` UNIQUE(`org_id`,`email`)
);
--> statement-breakpoint
CREATE TABLE `org_members` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` char(29) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`org_id` bigint unsigned NOT NULL,
	`invited_by_org_member_id` bigint unsigned,
	`status` enum('invited','active','removed') NOT NULL,
	`role` enum('member','admin') NOT NULL,
	`org_member_profile_id` bigint unsigned NOT NULL,
	`added_at` timestamp NOT NULL,
	`removed_at` timestamp,
	CONSTRAINT `org_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `public_id_idx` UNIQUE(`public_id`),
	CONSTRAINT `org_account_idx` UNIQUE(`org_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `org_member_profiles` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` char(30) NOT NULL,
	`org_id` bigint unsigned NOT NULL,
	`avatar_timestamp` timestamp,
	`user_id` varchar(255) NOT NULL,
	`first_name` varchar(64),
	`last_name` varchar(64),
	`handle` varchar(64),
	`title` varchar(64),
	`blurb` text,
	`created_at` timestamp NOT NULL,
	CONSTRAINT `org_member_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `public_id_idx` UNIQUE(`public_id`)
);
--> statement-breakpoint
CREATE TABLE `orgs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` char(28) NOT NULL,
	`avatar_timestamp` timestamp,
	`shortcode` varchar(64) NOT NULL,
	`owner_id` varchar(255) NOT NULL,
	`name` varchar(64) NOT NULL,
	`metadata` json DEFAULT ('{}'),
	`created_at` timestamp NOT NULL,
	CONSTRAINT `orgs_id` PRIMARY KEY(`id`),
	CONSTRAINT `public_id_idx` UNIQUE(`public_id`),
	CONSTRAINT `shortcode_idx` UNIQUE(`shortcode`)
);
--> statement-breakpoint
ALTER TABLE `authenticator` ADD CONSTRAINT `authenticator_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `org_id_idx` ON `org_invitations` (`org_id`);--> statement-breakpoint
CREATE INDEX `account_id_idx` ON `org_members` (`user_id`);--> statement-breakpoint
CREATE INDEX `org_id_idx` ON `org_members` (`org_id`);--> statement-breakpoint
CREATE INDEX `account_id_idx` ON `org_member_profiles` (`user_id`);