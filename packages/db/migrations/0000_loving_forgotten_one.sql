CREATE TABLE `account_credentials` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`account_id` bigint unsigned NOT NULL,
	`password_hash` varchar(255),
	`two_factor_secret` varchar(255),
	`two_factor_enabled` boolean NOT NULL DEFAULT false,
	`recovery_code` varchar(256),
	CONSTRAINT `account_credentials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `authenticators` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` char(29) NOT NULL,
	`account_credential_id` bigint unsigned NOT NULL,
	`account_id` bigint unsigned NOT NULL,
	`nickname` varchar(64) NOT NULL,
	`credential_id` varchar(255) NOT NULL,
	`credential_public_key` text NOT NULL,
	`counter` bigint unsigned NOT NULL,
	`credential_device_type` varchar(32) NOT NULL,
	`credential_backed_up` boolean NOT NULL,
	`transports` json,
	`created_at` timestamp NOT NULL,
	CONSTRAINT `authenticators_id` PRIMARY KEY(`id`),
	CONSTRAINT `credential_id_idx` UNIQUE(`credential_id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` char(29) NOT NULL,
	`account_id` bigint unsigned NOT NULL,
	`account_public_id` char(28) NOT NULL,
	`session_token` varchar(255) NOT NULL,
	`device` varchar(255) NOT NULL,
	`os` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_idx` UNIQUE(`session_token`)
);
--> statement-breakpoint
CREATE TABLE `accounts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` char(28) NOT NULL,
	`username` varchar(32) NOT NULL,
	`metadata` json,
	`created_at` timestamp,
	`last_login_at` timestamp,
	`password_hash` varchar(255),
	`two_factor_secret` varchar(255),
	`two_factor_enabled` boolean NOT NULL DEFAULT false,
	`recovery_code` varchar(256),
	`pre_account` boolean NOT NULL DEFAULT true,
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `public_id_idx` UNIQUE(`public_id`),
	CONSTRAINT `username_idx` UNIQUE(`username`)
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
	`account_id` bigint unsigned,
	`org_id` bigint unsigned NOT NULL,
	`invited_by_org_member_id` bigint unsigned,
	`status` enum('invited','active','removed') NOT NULL,
	`role` enum('member','admin') NOT NULL,
	`org_member_profile_id` bigint unsigned NOT NULL,
	`added_at` timestamp NOT NULL,
	`removed_at` timestamp,
	CONSTRAINT `org_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `public_id_idx` UNIQUE(`public_id`),
	CONSTRAINT `org_account_idx` UNIQUE(`org_id`,`account_id`)
);
--> statement-breakpoint
CREATE TABLE `org_member_profiles` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` char(30) NOT NULL,
	`org_id` bigint unsigned NOT NULL,
	`avatar_timestamp` timestamp,
	`account_id` bigint unsigned,
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
	`owner_id` bigint unsigned NOT NULL,
	`name` varchar(64) NOT NULL,
	`metadata` json DEFAULT ('{}'),
	`created_at` timestamp NOT NULL,
	CONSTRAINT `orgs_id` PRIMARY KEY(`id`),
	CONSTRAINT `public_id_idx` UNIQUE(`public_id`),
	CONSTRAINT `shortcode_idx` UNIQUE(`shortcode`)
);
--> statement-breakpoint
CREATE INDEX `account_id_idx` ON `account_credentials` (`account_id`);--> statement-breakpoint
CREATE INDEX `provider_account_id_idx` ON `authenticators` (`account_credential_id`);--> statement-breakpoint
CREATE INDEX `account_id_idx` ON `sessions` (`account_id`);--> statement-breakpoint
CREATE INDEX `expires_at_idx` ON `sessions` (`expires_at`);--> statement-breakpoint
CREATE INDEX `org_id_idx` ON `org_invitations` (`org_id`);--> statement-breakpoint
CREATE INDEX `account_id_idx` ON `org_members` (`account_id`);--> statement-breakpoint
CREATE INDEX `org_id_idx` ON `org_members` (`org_id`);--> statement-breakpoint
CREATE INDEX `account_id_idx` ON `org_member_profiles` (`account_id`);