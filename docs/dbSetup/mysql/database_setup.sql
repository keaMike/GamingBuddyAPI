-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema pnp8v7c0uy1mntqp
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS pnp8v7c0uy1mntqp;

USE `pnp8v7c0uy1mntqp`;

-- -----------------------------------------------------
-- Table `games`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `games` ;

CREATE TABLE IF NOT EXISTS `games` (
  `games_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `publisher` VARCHAR(100) NULL DEFAULT NULL,
  `genre` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`games_id`),
  UNIQUE INDEX `games_id_UNIQUE` (`games_id` ASC) VISIBLE,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `users` ;

CREATE TABLE IF NOT EXISTS `users` (
  `users_id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `bio` TEXT NULL DEFAULT NULL,
  `last_login` DATETIME NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`users_id`),
  UNIQUE INDEX `users_id_UNIQUE` (`users_id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `messages`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `messages` ;

CREATE TABLE IF NOT EXISTS `messages` (
  `message_id` INT(11) NOT NULL AUTO_INCREMENT,
  `sending_user_id` INT(11),
  `receiving_user_id` INT(11),
  `content` TEXT NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`message_id`),
  UNIQUE INDEX `message_id_UNIQUE` (`message_id` ASC) VISIBLE,
  INDEX `sending_id_idx` (`sending_user_id` ASC) VISIBLE,
  INDEX `receiving_id_idx` (`receiving_user_id` ASC) VISIBLE,
  CONSTRAINT `receiving_users_id`
    FOREIGN KEY (`receiving_user_id`)
    REFERENCES `users` (`users_id`)
    ON DELETE SET NULL,
  CONSTRAINT `sending_user_id`
    FOREIGN KEY (`sending_user_id`)
    REFERENCES `users` (`users_id`)
    ON DELETE SET NULL)

ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `platforms`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `platforms` ;

CREATE TABLE IF NOT EXISTS `platforms` (
  `platform_id` INT(11) NOT NULL AUTO_INCREMENT,
  `platformName` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`platform_id`),
  UNIQUE INDEX `platform_id_UNIQUE` (`platform_id` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `swipes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `swipes` ;

CREATE TABLE IF NOT EXISTS `swipes` (
  `swipe_id` INT(11) NOT NULL AUTO_INCREMENT,
  `sender_id` INT(11),
  `receiver_id` INT(11),
    -- New column
  `created_at` DATETIME,
  PRIMARY KEY (`swipe_id`),
  UNIQUE INDEX `Swipe_id_UNIQUE` (`swipe_id` ASC) VISIBLE,
  INDEX `receiver_id_idx` (`receiver_id` ASC) VISIBLE,
  INDEX `user_id_idx` (`sender_id` ASC) VISIBLE,
  CONSTRAINT `receiver_id`
    FOREIGN KEY (`receiver_id`)
    REFERENCES `users` (`users_id`)
    ON DELETE SET NULL,
  CONSTRAINT `sender_id`
    FOREIGN KEY (`sender_id`)
    REFERENCES `users` (`users_id`)
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `users_games`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `users_games` ;

CREATE TABLE IF NOT EXISTS `users_games` (
  `user_id` INT(11) NOT NULL,
  `game_id` INT(11) NOT NULL,
  `platform_id` INT(11) NOT NULL,
  `rank` VARCHAR(100) NULL DEFAULT NULL,
  `comment` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY id (user_id, game_id, platform_id),
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  INDEX `game_id_idx` (`game_id` ASC) VISIBLE,
  INDEX `users_games_platform_id` (`platform_id` ASC) VISIBLE,
  CONSTRAINT `users_games_game_id`
    FOREIGN KEY (`game_id`)
    REFERENCES `games` (`games_id`)
    ON DELETE CASCADE,
  CONSTRAINT `users_games_platform_id`
    FOREIGN KEY (`platform_id`)
    REFERENCES `platforms` (`platform_id`)
    ON DELETE CASCADE,
  CONSTRAINT `users_games_users_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`users_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `users_platforms`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `users_platforms` ;

CREATE TABLE IF NOT EXISTS `users_platforms` (
  `user_id` INT(11) NOT NULL,
  `platform_id` INT(11) NOT NULL,
  `gamertag` VARCHAR(100) NOT NULL,
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  INDEX `platform_id_idx` (`platform_id` ASC) VISIBLE,
  PRIMARY KEY id (user_id, platform_id),
  CONSTRAINT `users_platforms_platform_id`
    FOREIGN KEY (`platform_id`)
    REFERENCES `platforms` (`platform_id`)
    ON DELETE CASCADE,
  CONSTRAINT `users_platforms_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`users_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `users_versions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `users_versions` ;

CREATE TABLE IF NOT EXISTS `users_versions` (
  `users_versions_id` INT(11) NOT NULL AUTO_INCREMENT,
  `users_id` INT(11) NOT NULL,
  `username` VARCHAR(100),
  `email` VARCHAR(100),
  `bio` TEXT,
  `last_login` DATETIME,
  `created_at` DATETIME,
  `action` VARCHAR(100),
  `action_time` DATETIME,
  PRIMARY KEY (`users_versions_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `dailyStatistics`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `daily_statistics` ;

CREATE TABLE IF NOT EXISTS `daily_statistics` (
  `statistics_id` INT(11) NOT NULL AUTO_INCREMENT,
  `date` DATETIME,
  `users_Count` INT(11),
  `login_past_today` INT(11),
  `login_past_week` INT(11),
  `users_swipes_today` INT(11),
  `users_swipes_week` INT(11),
  `users_swipes_total` INT(11),
  `average_games_user` INT(11),
  INDEX `statistics_idx` (`statistics_id` ASC) VISIBLE,
  PRIMARY KEY (`statistics_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Triggers
-- -----------------------------------------------------

-- Trigger sets datetime for added swipe, since the column was added after initial creation,
-- this trigger means no changes in backend code
DROP TRIGGER IF EXISTS set_dateTime;

create trigger set_dateTime
    before insert
    on swipes
    for each row
begin
    set NEW.created_at = NOW();
end;

-- Trigger that saves a copy of the user row before delete
DROP TRIGGER IF EXISTS clone_user_data_delete;

create trigger clone_user_data_delete
    before  delete
    on users
    for each row
begin
    INSERT INTO users_versions (users_id, username, email, bio, last_login, created_at, action, action_time)
    VALUES(OLD.users_id, OLD.username, OLD.email, OLD.bio, OLD.last_login, OLD.created_at, 'DELETE', NOW());
end;

-- Trigger that saves a copy of the user row before an update
DROP TRIGGER IF EXISTS clone_user_data_update;

create TRIGGER clone_user_data_update
    before  update
    on users
    for each row
begin
    INSERT INTO users_versions (users_id, username, email, bio, last_login, created_at, action, action_time)
    VALUES(OLD.users_id, OLD.username, OLD.email, OLD.bio, OLD.last_login, OLD.created_at, 'Update', NOW());
end;

-- -----------------------------------------------------
-- Events
-- -----------------------------------------------------

DROP EVENT IF EXISTS dailyStatistics;

create event dailyStatistics on schedule
    every 24 hour
    -- Start time reflects when the first event takes place, then subsequently every 24 hours
    STARTS '2021-09-30 09:00:00'
    COMMENT 'Count and creates statistics of specific metrics every 24 hours'
    do
        INSERT INTO daily_statistics(date, users_Count, login_past_today, login_past_week, users_swipes_today,
                                     users_swipes_week, users_swipes_total, average_games_user)
            SELECT CURRENT_TIMESTAMP,
            (SELECT COUNT(users_id) FROM users),
            (SELECT COUNT(users_id) FROM users WHERE last_login > (NOW() - INTERVAL 1 DAY)),
            (SELECT COUNT(users_id) FROM users WHERE last_login > (NOW() - INTERVAL 7 DAY)),
            (SELECT COUNT(swipe_id) FROM swipes WHERE created_at > (NOW() - INTERVAL 1 DAY)),
            (SELECT COUNT(swipe_id) FROM swipes WHERE created_at > (NOW() - INTERVAL 7 DAY)),
            (SELECT COUNT(swipe_id) FROM swipes),
            (SELECT avg(a.rcount) FROM (SELECT COUNT(game_id) as rcount FROM users_games group by user_id) as a);

-- -----------------------------------------------------
-- Functions
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Function `MessagesReceived`
-- -----------------------------------------------------

DROP FUNCTION IF EXISTS MessagesReceived;

DELIMITER $$
CREATE FUNCTION MessagesReceived(
    receiverID INT(11)
)
RETURNS INT(11)
DETERMINISTIC
BEGIN
    RETURN (SELECT COUNT(*) FROM messages WHERE receiving_user_id = receiverID);
END$$
DELIMITER ;

-- -----------------------------------------------------
-- Function `MessagesSent`
-- -----------------------------------------------------

DROP FUNCTION IF EXISTS MessagesSent;

DELIMITER $$
CREATE FUNCTION MessagesSent(
    senderID INT(11)
)
RETURNS INT(11)
DETERMINISTIC
BEGIN
    RETURN (SELECT COUNT(*) FROM messages WHERE sending_user_id = senderID);
END$$
DELIMITER ;

-- -----------------------------------------------------
-- Function `AllMessages`
-- -----------------------------------------------------

DROP FUNCTION IF EXISTS AllMessages;

DELIMITER $$
CREATE FUNCTION AllMessages(
    userID INT(11)
)
RETURNS INT(11)
DETERMINISTIC
BEGIN
    RETURN (SELECT COUNT(*) FROM messages WHERE sending_user_id = userID OR receiving_user_id = userID);
END$$
DELIMITER ;

-- -----------------------------------------------------
-- Function `IsAMatch`
-- -----------------------------------------------------

DROP FUNCTION IF EXISTS IsAMatch;

DELIMITER $$
CREATE FUNCTION IsAMatch(
    user0ID INT(11),
    user1ID INT(11)
)
RETURNS bool
DETERMINISTIC
BEGIN
    DECLARE user0SwipeOnUser1Count INT(11);
    DECLARE user1SwipeOnUser0Count INT(11);
    DECLARE matched bool;

    SET matched = false;

    SELECT COUNT(*) FROM swipes WHERE sender_id = user0ID AND receiver_id = user1ID INTO user0SwipeOnUser1Count;
    SELECT COUNT(*) FROM swipes WHERE sender_id = user1ID AND receiver_id = user0ID INTO user1SwipeOnUser0Count;

    IF (user0SwipeOnUser1Count NOT LIKE 0 AND user1SwipeOnUser0Count NOT LIKE 0) THEN
        SET matched = true;
    end if;

    RETURN (matched);
END$$
DELIMITER ;

-- -----------------------------------------------------
-- Views
-- -----------------------------------------------------

-- -----------------------------------------------------
-- View `view_games_played_by_users`
-- -----------------------------------------------------

DROP VIEW IF EXISTS view_games_played_by_users;

CREATE VIEW view_games_played_by_users AS
SELECT
    users.users_id,
    users.username,
    g.name AS game
FROM users
    JOIN users_games ug on users.users_id = ug.user_id
    JOIN games g on g.games_id = ug.game_id;

-- -----------------------------------------------------
-- Views
-- -----------------------------------------------------

-- -----------------------------------------------------
-- View `getUserGames`
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS getUserGames;

CREATE PROCEDURE getUserGames(IN user_id int)
BEGIN
SELECT
    g.games_id,
    g.name
FROM games g
LEFT JOIN users_games ug ON ug.game_id = g.games_id
WHERE ug.user_id = user_id;
END;

-- -----------------------------------------------------
-- View `getUserPlatforms`
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS getUserPlatforms;

CREATE PROCEDURE getUserPlatforms(IN user_id int)
BEGIN
SELECT
    p.platform_id,
    p.platformName
FROM platforms p
LEFT JOIN users_platforms ug ON ug.platform_id = p.platform_id
WHERE ug.user_id = user_id;
END;

-- -----------------------------------------------------
-- View `user_profiles`
-- -----------------------------------------------------

DROP VIEW IF EXISTS user_profiles;

CREATE VIEW user_profiles AS
    SELECT
        u.users_id AS id,
        u.username,
        u.bio,
        (SELECT
          JSON_ARRAYAGG(JSON_OBJECT('id', g.games_id, 'name', g.name, 'publisher', g.publisher, 'genre', g.genre, 'rank', ug.rank, 'comment', ug.comment))
          FROM users_games ug
          JOIN games g ON g.games_id = ug.game_id
          WHERE ug.user_id = u.users_id
        ) AS games,
        (SELECT
          JSON_ARRAYAGG(JSON_OBJECT('id', p.platform_id, 'platform', p.platformName, 'gamertag', up.gamertag))
          FROM users_platforms up
          JOIN platforms p ON p.platform_id = up.platform_id
          WHERE up.user_id = u.users_id
        ) AS platforms
      FROM users u;