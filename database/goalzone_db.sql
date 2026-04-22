-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 22-04-2026 a las 05:06:09
-- Versión del servidor: 9.1.0
-- Versión de PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `goalzone_db`
--

DELIMITER $$
--
-- Procedimientos
--
DROP PROCEDURE IF EXISTS `sp_login`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_login` (IN `p_username` VARCHAR(60), IN `p_password_plain` VARCHAR(255), OUT `p_result` INT, OUT `p_role` VARCHAR(20), OUT `p_user_id` INT)   BEGIN
    DECLARE v_hash     CHAR(64);
    DECLARE v_db_hash  CHAR(64);
    DECLARE v_exists   INT DEFAULT 0;

    -- SHA2 de MySQL usa SHA-256 con segundo parámetro = 256
    SET v_hash = SHA2(p_password_plain, 256);

    SELECT COUNT(*), password_hash, role, id
    INTO v_exists, v_db_hash, p_role, p_user_id
    FROM users WHERE username = p_username;

    IF v_exists = 0 THEN
        SET p_result = 1; -- usuario no existe
    ELSEIF v_hash != v_db_hash THEN
        SET p_result = 2; -- contraseña incorrecta
    ELSE
        SET p_result = 0; -- login OK
        UPDATE users SET last_login = NOW() WHERE id = p_user_id;
    END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `leagues`
--

DROP TABLE IF EXISTS `leagues`;
CREATE TABLE IF NOT EXISTS `leagues` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `teams_count` tinyint UNSIGNED DEFAULT '20',
  `season` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT '2024/25',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `leagues`
--

INSERT INTO `leagues` (`id`, `code`, `name`, `country`, `teams_count`, `season`, `created_at`) VALUES
(1, 'pl', 'Premier League', 'Inglaterra', 20, '2024/25', '2026-04-22 03:17:44'),
(2, 'll', 'La Liga', 'España', 20, '2024/25', '2026-04-22 03:17:44'),
(3, 'sa', 'Serie A', 'Italia', 20, '2024/25', '2026-04-22 03:17:44'),
(4, 'cl', 'Champions League', 'Europa', 32, '2024/25', '2026-04-22 03:17:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `legends`
--

DROP TABLE IF EXISTS `legends`;
CREATE TABLE IF NOT EXISTS `legends` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `league` enum('pl','ll','sa') COLLATE utf8mb4_unicode_ci NOT NULL,
  `club` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `years` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationality` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jersey_num` tinyint UNSIGNED DEFAULT NULL,
  `goals` int UNSIGNED DEFAULT '0',
  `bio` text COLLATE utf8mb4_unicode_ci,
  `image_file` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Nombre del archivo SVG en /img/',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `legends`
--

INSERT INTO `legends` (`id`, `name`, `league`, `club`, `years`, `nationality`, `jersey_num`, `goals`, `bio`, `image_file`, `created_at`) VALUES
(1, 'Thierry Henry', 'pl', 'Arsenal', '1999-2007', 'Francia', 14, 228, NULL, 'henry.svg', '2026-04-22 03:17:44'),
(2, 'Didier Drogba', 'pl', 'Chelsea', '2004-2012', 'Costa Marfil', 11, 164, NULL, 'drogba.svg', '2026-04-22 03:17:44'),
(3, 'Lionel Messi', 'll', 'FC Barcelona', '2004-2021', 'Argentina', 10, 474, NULL, 'messi.svg', '2026-04-22 03:17:44'),
(4, 'Cristiano Ronaldo', 'll', 'Real Madrid', '2009-2018', 'Portugal', 7, 450, NULL, 'ronaldo_cr7.svg', '2026-04-22 03:17:44'),
(5, 'Ronaldo Nazário', 'sa', 'Inter Milan', '1997-2002', 'Brasil', 9, 49, NULL, 'ronaldo_nazario.svg', '2026-04-22 03:17:44'),
(6, 'Diego Maradona', 'sa', 'SSC Napoli', '1984-1991', 'Argentina', 10, 115, NULL, 'maradona.svg', '2026-04-22 03:17:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `matches`
--

DROP TABLE IF EXISTS `matches`;
CREATE TABLE IF NOT EXISTS `matches` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `home_team` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `away_team` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `goals_home` tinyint UNSIGNED DEFAULT NULL,
  `goals_away` tinyint UNSIGNED DEFAULT NULL,
  `league` enum('pl','ll','sa','cl') COLLATE utf8mb4_unicode_ci NOT NULL,
  `match_date` date NOT NULL,
  `match_time` time DEFAULT NULL,
  `status` enum('next','live','fin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'next',
  `round` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stadium` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` int UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_match_user` (`created_by`),
  KEY `idx_league_date` (`league`,`match_date`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `matches`
--

INSERT INTO `matches` (`id`, `home_team`, `away_team`, `goals_home`, `goals_away`, `league`, `match_date`, `match_time`, `status`, `round`, `stadium`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Manchester City', 'Arsenal', 2, 1, 'pl', '2025-04-18', NULL, 'fin', 'Jornada 32', NULL, NULL, '2026-04-22 03:17:44', '2026-04-22 03:17:44'),
(2, 'Liverpool', 'Chelsea', 3, 1, 'pl', '2025-04-18', NULL, 'fin', 'Jornada 32', NULL, NULL, '2026-04-22 03:17:44', '2026-04-22 03:17:44'),
(3, 'Man United', 'Tottenham', 1, 1, 'pl', '2025-04-19', NULL, 'live', 'Jornada 32', NULL, NULL, '2026-04-22 03:17:44', '2026-04-22 03:17:44'),
(4, 'Aston Villa', 'Newcastle', NULL, NULL, 'pl', '2025-04-20', NULL, 'next', 'Jornada 32', NULL, NULL, '2026-04-22 03:17:44', '2026-04-22 03:17:44'),
(5, 'Brighton', 'Brentford', NULL, NULL, 'pl', '2025-04-21', NULL, 'next', 'Jornada 32', NULL, NULL, '2026-04-22 03:17:44', '2026-04-22 03:17:44'),
(6, 'Real Madrid', 'FC Barcelona', 2, 2, 'll', '2025-04-17', NULL, 'fin', 'Jornada 32', NULL, NULL, '2026-04-22 03:17:44', '2026-04-22 03:17:44'),
(7, 'Atlético Madrid', 'Sevilla', 1, 0, 'll', '2025-04-18', NULL, 'fin', 'Jornada 32', NULL, NULL, '2026-04-22 03:17:44', '2026-04-22 03:17:44'),
(8, 'Valencia', 'Villarreal', 2, 3, 'll', '2025-04-19', NULL, 'live', 'Jornada 32', NULL, NULL, '2026-04-22 03:17:44', '2026-04-22 03:17:44'),
(9, 'Real Sociedad', 'Athletic Club', NULL, NULL, 'll', '2025-04-20', NULL, 'next', 'Jornada 32', NULL, NULL, '2026-04-22 03:17:44', '2026-04-22 03:17:44'),
(10, 'Celta Vigo', 'Getafe', NULL, NULL, 'll', '2025-04-21', NULL, 'next', 'Jornada 32', NULL, NULL, '2026-04-22 03:17:44', '2026-04-22 03:17:44'),
(11, 'Inter Milan', 'AC Milan', 2, 0, 'sa', '2025-04-17', NULL, 'fin', 'Jornada 32', NULL, NULL, '2026-04-22 03:17:44', '2026-04-22 03:17:44'),
(12, 'Juventus', 'Napoli', 1, 1, 'sa', '2025-04-18', NULL, 'fin', 'Jornada 32', NULL, NULL, '2026-04-22 03:17:44', '2026-04-22 03:17:44'),
(13, 'Roma', 'Lazio', NULL, NULL, 'sa', '2025-04-19', NULL, 'next', 'Jornada 32', NULL, NULL, '2026-04-22 03:17:44', '2026-04-22 03:17:44'),
(14, 'Atalanta', 'Fiorentina', NULL, NULL, 'sa', '2025-04-20', NULL, 'next', 'Jornada 32', NULL, NULL, '2026-04-22 03:17:44', '2026-04-22 03:17:44'),
(15, 'Torino', 'Udinese', 1, 2, 'sa', '2025-04-16', NULL, 'fin', 'Jornada 32', NULL, NULL, '2026-04-22 03:17:44', '2026-04-22 03:17:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `scorers`
--

DROP TABLE IF EXISTS `scorers`;
CREATE TABLE IF NOT EXISTS `scorers` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `player_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `club` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `league` enum('pl','ll','sa','cl') COLLATE utf8mb4_unicode_ci NOT NULL,
  `goals` tinyint UNSIGNED DEFAULT '0',
  `assists` tinyint UNSIGNED DEFAULT '0',
  `matches_played` tinyint UNSIGNED DEFAULT '0',
  `nationality` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `season` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT '2024/25',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_player_league_season` (`player_name`,`league`,`season`),
  KEY `idx_league_goals` (`league`,`goals` DESC)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `scorers`
--

INSERT INTO `scorers` (`id`, `player_name`, `club`, `league`, `goals`, `assists`, `matches_played`, `nationality`, `season`, `updated_at`) VALUES
(1, 'Erling Haaland', 'Manchester City', 'pl', 23, 7, 28, 'Noruega', '2024/25', '2026-04-22 03:17:44'),
(2, 'Cole Palmer', 'Chelsea', 'pl', 21, 11, 30, 'Inglaterra', '2024/25', '2026-04-22 03:17:44'),
(3, 'Alexander Isak', 'Newcastle', 'pl', 19, 5, 29, 'Suecia', '2024/25', '2026-04-22 03:17:44'),
(4, 'Mohamed Salah', 'Liverpool', 'pl', 18, 13, 32, 'Egipto', '2024/25', '2026-04-22 03:17:44'),
(5, 'Son Heung-min', 'Tottenham', 'pl', 15, 8, 31, 'Corea del Sur', '2024/25', '2026-04-22 03:17:44'),
(6, 'Bukayo Saka', 'Arsenal', 'pl', 14, 12, 32, 'Inglaterra', '2024/25', '2026-04-22 03:17:44'),
(7, 'Marcus Rashford', 'Man United', 'pl', 12, 5, 27, 'Inglaterra', '2024/25', '2026-04-22 03:17:44'),
(8, 'Artem Dovbyk', 'Girona', 'll', 22, 6, 30, 'Ucrania', '2024/25', '2026-04-22 03:17:44'),
(9, 'Jude Bellingham', 'Real Madrid', 'll', 19, 10, 30, 'Inglaterra', '2024/25', '2026-04-22 03:17:44'),
(10, 'Robert Lewandowski', 'FC Barcelona', 'll', 18, 8, 29, 'Polonia', '2024/25', '2026-04-22 03:17:44'),
(11, 'Antoine Griezmann', 'Atlético Madrid', 'll', 16, 10, 32, 'Francia', '2024/25', '2026-04-22 03:17:44'),
(12, 'Vinicius Jr.', 'Real Madrid', 'll', 15, 9, 28, 'Brasil', '2024/25', '2026-04-22 03:17:44'),
(13, 'Pedri', 'FC Barcelona', 'll', 11, 14, 31, 'España', '2024/25', '2026-04-22 03:17:44'),
(14, 'Iker Bravo', 'Real Betis', 'll', 10, 4, 28, 'España', '2024/25', '2026-04-22 03:17:44'),
(15, 'Lautaro Martínez', 'Inter Milan', 'sa', 27, 8, 30, 'Argentina', '2024/25', '2026-04-22 03:17:44'),
(16, 'Dusan Vlahovic', 'Juventus', 'sa', 18, 4, 28, 'Serbia', '2024/25', '2026-04-22 03:17:44'),
(17, 'Romelu Lukaku', 'Roma', 'sa', 15, 7, 29, 'Bélgica', '2024/25', '2026-04-22 03:17:44'),
(18, 'Olivier Giroud', 'AC Milan', 'sa', 14, 3, 27, 'Francia', '2024/25', '2026-04-22 03:17:44'),
(19, 'Ademola Lookman', 'Atalanta', 'sa', 13, 9, 31, 'Nigeria', '2024/25', '2026-04-22 03:17:44'),
(20, 'Victor Osimhen', 'Napoli', 'sa', 12, 5, 26, 'Nigeria', '2024/25', '2026-04-22 03:17:44'),
(21, 'Paulo Dybala', 'Roma', 'sa', 11, 8, 28, 'Argentina', '2024/25', '2026-04-22 03:17:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Token SHA-256 de la sesión',
  `user_id` int UNSIGNED NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_last_activity` (`last_activity`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sesiones de usuario (equivalente cookie HTTPOnly)';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `standings`
--

DROP TABLE IF EXISTS `standings`;
CREATE TABLE IF NOT EXISTS `standings` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `team_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `league` enum('pl','ll','sa') COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` tinyint UNSIGNED NOT NULL,
  `played` tinyint UNSIGNED DEFAULT '0',
  `won` tinyint UNSIGNED DEFAULT '0',
  `drawn` tinyint UNSIGNED DEFAULT '0',
  `lost` tinyint UNSIGNED DEFAULT '0',
  `goals_for` smallint UNSIGNED DEFAULT '0',
  `goals_ag` smallint UNSIGNED DEFAULT '0',
  `points` smallint UNSIGNED DEFAULT '0',
  `season` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT '2024/25',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_team_league_season` (`team_name`,`league`,`season`),
  KEY `idx_league_pos` (`league`,`position`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `standings`
--

INSERT INTO `standings` (`id`, `team_name`, `league`, `position`, `played`, `won`, `drawn`, `lost`, `goals_for`, `goals_ag`, `points`, `season`, `updated_at`) VALUES
(1, 'Arsenal', 'pl', 1, 32, 23, 6, 3, 71, 28, 75, '2024/25', '2026-04-22 03:17:44'),
(2, 'Manchester City', 'pl', 2, 32, 21, 8, 3, 68, 32, 71, '2024/25', '2026-04-22 03:17:44'),
(3, 'Liverpool', 'pl', 3, 32, 20, 8, 4, 74, 40, 68, '2024/25', '2026-04-22 03:17:44'),
(4, 'Chelsea', 'pl', 4, 32, 18, 8, 6, 62, 40, 62, '2024/25', '2026-04-22 03:17:44'),
(5, 'Aston Villa', 'pl', 5, 32, 17, 8, 7, 68, 51, 59, '2024/25', '2026-04-22 03:17:44'),
(6, 'Newcastle', 'pl', 6, 32, 16, 7, 9, 64, 48, 55, '2024/25', '2026-04-22 03:17:44'),
(7, 'Tottenham', 'pl', 7, 32, 14, 9, 9, 57, 56, 51, '2024/25', '2026-04-22 03:17:44'),
(8, 'Brighton', 'pl', 8, 32, 13, 8, 11, 59, 54, 47, '2024/25', '2026-04-22 03:17:44'),
(9, 'Brentford', 'pl', 9, 32, 12, 8, 12, 54, 58, 44, '2024/25', '2026-04-22 03:17:44'),
(10, 'Fulham', 'pl', 10, 32, 11, 9, 12, 48, 52, 42, '2024/25', '2026-04-22 03:17:44'),
(11, 'Wolves', 'pl', 11, 32, 11, 6, 15, 44, 54, 39, '2024/25', '2026-04-22 03:17:44'),
(12, 'West Ham', 'pl', 12, 32, 10, 8, 14, 42, 56, 38, '2024/25', '2026-04-22 03:17:44'),
(13, 'Crystal Palace', 'pl', 13, 32, 9, 8, 15, 38, 52, 35, '2024/25', '2026-04-22 03:17:44'),
(14, 'Man United', 'pl', 14, 32, 10, 5, 17, 34, 50, 35, '2024/25', '2026-04-22 03:17:44'),
(15, 'Nottm Forest', 'pl', 15, 32, 8, 7, 17, 36, 54, 31, '2024/25', '2026-04-22 03:17:44'),
(16, 'Everton', 'pl', 16, 32, 6, 10, 16, 34, 60, 28, '2024/25', '2026-04-22 03:17:44'),
(17, 'Luton Town', 'pl', 17, 32, 5, 8, 19, 30, 66, 23, '2024/25', '2026-04-22 03:17:44'),
(18, 'Burnley', 'pl', 18, 32, 4, 10, 18, 30, 71, 22, '2024/25', '2026-04-22 03:17:44'),
(19, 'Sheffield Utd', 'pl', 19, 32, 3, 7, 22, 26, 81, 16, '2024/25', '2026-04-22 03:17:44'),
(20, 'Bournemouth', 'pl', 20, 32, 3, 5, 24, 24, 76, 14, '2024/25', '2026-04-22 03:17:44'),
(21, 'Real Madrid', 'll', 1, 32, 24, 5, 3, 82, 28, 77, '2024/25', '2026-04-22 03:17:44'),
(22, 'FC Barcelona', 'll', 2, 32, 22, 7, 3, 77, 36, 73, '2024/25', '2026-04-22 03:17:44'),
(23, 'Atlético Madrid', 'll', 3, 32, 20, 6, 6, 64, 36, 66, '2024/25', '2026-04-22 03:17:44'),
(24, 'Athletic Club', 'll', 4, 32, 17, 9, 6, 58, 38, 60, '2024/25', '2026-04-22 03:17:44'),
(25, 'Real Sociedad', 'll', 5, 32, 16, 7, 9, 52, 44, 55, '2024/25', '2026-04-22 03:17:44'),
(26, 'Villarreal', 'll', 6, 32, 14, 8, 10, 51, 48, 50, '2024/25', '2026-04-22 03:17:44'),
(27, 'Betis', 'll', 7, 32, 13, 8, 11, 50, 50, 47, '2024/25', '2026-04-22 03:17:44'),
(28, 'Valencia', 'll', 8, 32, 12, 8, 12, 44, 48, 44, '2024/25', '2026-04-22 03:17:44'),
(29, 'Sevilla', 'll', 9, 32, 11, 7, 14, 42, 50, 40, '2024/25', '2026-04-22 03:17:44'),
(30, 'Osasuna', 'll', 10, 32, 10, 9, 13, 40, 48, 39, '2024/25', '2026-04-22 03:17:44'),
(31, 'Las Palmas', 'll', 11, 32, 10, 7, 15, 38, 52, 37, '2024/25', '2026-04-22 03:17:44'),
(32, 'Celta Vigo', 'll', 12, 32, 9, 9, 14, 42, 54, 36, '2024/25', '2026-04-22 03:17:44'),
(33, 'Rayo Vallecano', 'll', 13, 32, 9, 7, 16, 38, 54, 34, '2024/25', '2026-04-22 03:17:44'),
(34, 'Getafe', 'll', 14, 32, 8, 8, 16, 34, 50, 32, '2024/25', '2026-04-22 03:17:44'),
(35, 'Girona', 'll', 15, 32, 8, 6, 18, 38, 58, 30, '2024/25', '2026-04-22 03:17:44'),
(36, 'Cádiz', 'll', 16, 32, 7, 7, 18, 30, 58, 28, '2024/25', '2026-04-22 03:17:44'),
(37, 'Mallorca', 'll', 17, 32, 6, 8, 18, 28, 56, 26, '2024/25', '2026-04-22 03:17:44'),
(38, 'Almería', 'll', 18, 32, 4, 9, 19, 25, 65, 21, '2024/25', '2026-04-22 03:17:44'),
(39, 'Granada', 'll', 19, 32, 3, 7, 22, 24, 70, 16, '2024/25', '2026-04-22 03:17:44'),
(40, 'Alavés', 'll', 20, 32, 2, 8, 22, 20, 68, 14, '2024/25', '2026-04-22 03:17:44'),
(41, 'Inter Milan', 'sa', 1, 32, 25, 5, 2, 82, 24, 80, '2024/25', '2026-04-22 03:17:44'),
(42, 'AC Milan', 'sa', 2, 32, 20, 8, 4, 71, 40, 68, '2024/25', '2026-04-22 03:17:44'),
(43, 'Juventus', 'sa', 3, 32, 19, 8, 5, 58, 32, 65, '2024/25', '2026-04-22 03:17:44'),
(44, 'Atalanta', 'sa', 4, 32, 19, 6, 7, 76, 46, 63, '2024/25', '2026-04-22 03:17:44'),
(45, 'Roma', 'sa', 5, 32, 17, 8, 7, 64, 48, 59, '2024/25', '2026-04-22 03:17:44'),
(46, 'Lazio', 'sa', 6, 32, 16, 7, 9, 60, 52, 55, '2024/25', '2026-04-22 03:17:44'),
(47, 'Fiorentina', 'sa', 7, 32, 15, 7, 10, 58, 54, 52, '2024/25', '2026-04-22 03:17:44'),
(48, 'Napoli', 'sa', 8, 32, 14, 8, 10, 60, 56, 50, '2024/25', '2026-04-22 03:17:44'),
(49, 'Torino', 'sa', 9, 32, 12, 9, 11, 46, 48, 45, '2024/25', '2026-04-22 03:17:44'),
(50, 'Bologna', 'sa', 10, 32, 12, 7, 13, 48, 52, 43, '2024/25', '2026-04-22 03:17:44'),
(51, 'Monza', 'sa', 11, 32, 11, 8, 13, 42, 50, 41, '2024/25', '2026-04-22 03:17:44'),
(52, 'Genoa', 'sa', 12, 32, 10, 8, 14, 40, 52, 38, '2024/25', '2026-04-22 03:17:44'),
(53, 'Lecce', 'sa', 13, 32, 9, 7, 16, 36, 56, 34, '2024/25', '2026-04-22 03:17:44'),
(54, 'Cagliari', 'sa', 14, 32, 8, 8, 16, 34, 58, 32, '2024/25', '2026-04-22 03:17:44'),
(55, 'Udinese', 'sa', 15, 32, 8, 6, 18, 36, 62, 30, '2024/25', '2026-04-22 03:17:44'),
(56, 'Empoli', 'sa', 16, 32, 7, 6, 19, 30, 60, 27, '2024/25', '2026-04-22 03:17:44'),
(57, 'Frosinone', 'sa', 17, 32, 7, 7, 18, 38, 64, 28, '2024/25', '2026-04-22 03:17:44'),
(58, 'Sassuolo', 'sa', 18, 32, 4, 7, 21, 30, 68, 19, '2024/25', '2026-04-22 03:17:44'),
(59, 'Salernitana', 'sa', 19, 32, 3, 8, 21, 28, 74, 17, '2024/25', '2026-04-22 03:17:44'),
(60, 'Verona', 'sa', 20, 32, 3, 5, 24, 26, 82, 14, '2024/25', '2026-04-22 03:17:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` char(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'SHA-256 hex (64 chars)',
  `role` enum('admin','user') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Usuarios del sistema';

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `role`, `name`, `email`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'admin', 'Administrador', 'admin@goalzone.com', NULL, '2026-04-22 03:17:44', '2026-04-22 03:17:44'),
(2, 'user1', '1d5a9e977ab65c96ae2a43d74addd0f6c1f98e6ed9ad24edcc9ca7c98af06db0', 'user', 'Usuario Invitado', 'user1@goalzone.com', NULL, '2026-04-22 03:17:44', '2026-04-22 03:17:44'),
(3, 'aaaa', '649f60f4ec000de15035f6602557d0855438a53ac2e50307e0fe51dc48de5589', 'admin', 'aaa', 'aaaa@gmail.com', NULL, '2026-04-22 10:30:46', '2026-04-22 04:33:56'),
(4, 'ariel', '5d28362c381d00ae5d6220c839c12153176107d3d42c8f937a0d0da8eeb5b5a2', 'admin', 'aaa', 'ariel@goalzone.com', NULL, '2026-04-22 10:38:45', '2026-04-22 10:38:45'),
(5, 'prueba', 'd908fe900d3540769ecea602cadb660cb4d43cacbeb16e90a99b99f95309ddec', 'admin', 'ola', 'prueba@goalzone.com', NULL, '2026-04-22 10:51:55', '2026-04-22 10:51:55');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_standings`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `v_standings`;
CREATE TABLE IF NOT EXISTS `v_standings` (
`DG` int unsigned
,`equipo` varchar(100)
,`GC` smallint unsigned
,`GF` smallint unsigned
,`league` enum('pl','ll','sa')
,`PE` tinyint unsigned
,`PG` tinyint unsigned
,`PJ` tinyint unsigned
,`pos` tinyint unsigned
,`PP` tinyint unsigned
,`PTS` smallint unsigned
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_top_scorers`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `v_top_scorers`;
CREATE TABLE IF NOT EXISTS `v_top_scorers` (
`assists` tinyint unsigned
,`club` varchar(100)
,`goals` tinyint unsigned
,`league` enum('pl','ll','sa','cl')
,`player_name` varchar(100)
,`ranking` bigint unsigned
);

-- --------------------------------------------------------

--
-- Estructura para la vista `v_standings`
--
DROP TABLE IF EXISTS `v_standings`;

DROP VIEW IF EXISTS `v_standings`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_standings`  AS SELECT `standings`.`position` AS `pos`, `standings`.`team_name` AS `equipo`, `standings`.`league` AS `league`, `standings`.`played` AS `PJ`, `standings`.`won` AS `PG`, `standings`.`drawn` AS `PE`, `standings`.`lost` AS `PP`, `standings`.`goals_for` AS `GF`, `standings`.`goals_ag` AS `GC`, (`standings`.`goals_for` - `standings`.`goals_ag`) AS `DG`, `standings`.`points` AS `PTS` FROM `standings` ORDER BY `standings`.`league` ASC, `standings`.`position` ASC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_top_scorers`
--
DROP TABLE IF EXISTS `v_top_scorers`;

DROP VIEW IF EXISTS `v_top_scorers`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_top_scorers`  AS SELECT rank()  (PARTITION BY `scorers`.`league` ORDER BY `scorers`.`goals` desc ) AS `OVER` FROM `scorers` WHERE (`scorers`.`season` = '2024/25') ORDER BY `scorers`.`league` ASC, `scorers`.`goals` DESC ;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `matches`
--
ALTER TABLE `matches`
  ADD CONSTRAINT `fk_match_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `fk_session_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
